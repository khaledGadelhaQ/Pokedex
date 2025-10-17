import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

/**
 * SIMPLE: Download one image from a URL and save it
 *
 * What it does:
 * 1. Creates the folder if it doesn't exist
 * 2. Downloads the image from the URL
 * 3. Saves it to the outputPath
 */
async function downloadImage(url: string, outputPath: string): Promise<void> {
  // Create folder if needed
  const folder = path.dirname(outputPath);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  // Download and save the image
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);

    https
      .get(url, (response) => {
        // Check if download was successful
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode}`));
          return;
        }

        // Save the image
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      })
      .on('error', (err) => {
        fs.unlink(outputPath, () => {}); // Delete incomplete file
        reject(err);
      });

    file.on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Delete incomplete file
      reject(err);
    });
  });
}

/**
 * SIMPLE: Download all sprites for one Pokemon
 *
 * What it does:
 * 1. Takes sprite URLs from PokeAPI
 * 2. Downloads each image (8 types: front, back, shiny, female versions)
 * 3. Saves them with names like: 25-front_default.png
 * 4. Returns paths like: /images/sprites/25-front_default.png
 */
export async function downloadPokemonSprites(
  pokemonId: number,
  sprites: Record<string, string | null>,
  uploadsDir: string,
): Promise<Record<string, string | null>> {
  // All the sprite types we want to download
  const spriteTypes = [
    'front_default',
    'front_female',
    'front_shiny',
    'front_shiny_female',
    'back_default',
    'back_female',
    'back_shiny',
    'back_shiny_female',
  ];

  const result: Record<string, string | null> = {};

  // Download each sprite
  for (const type of spriteTypes) {
    const url = sprites[type];

    if (url) {
      // Build filename: 25-front_default.png
      const filename = `${pokemonId}-${type}.png`;
      const savePath = path.join(uploadsDir, 'sprites', filename);

      try {
        // Download the image
        await downloadImage(url, savePath);

        // Save the URL path for the database
        result[type] = `/images/sprites/${filename}`;
      } catch {
        console.warn(`⚠️  Failed to download ${type} for Pokemon ${pokemonId}`);
        result[type] = url; // Keep original URL if download fails
      }
    } else {
      result[type] = null; // No image available
    }
  }

  return result;
}
