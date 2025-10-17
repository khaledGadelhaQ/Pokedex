import { PrismaClient, Prisma } from '@prisma/client';
import * as https from 'https';
import * as path from 'path';
import { PokeApiPokemon } from './types/pokeapi.types';
import { downloadPokemonSprites } from '../src/utils/image-downloader';

const prisma = new PrismaClient();
const uploadsDir = path.join(__dirname, '../uploads');

function fetchPokemon(idOrName: string): Promise<PokeApiPokemon> {
  return new Promise((resolve, reject) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${idOrName.toLowerCase()}`;

    https
      .get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data) as PokeApiPokemon);
          } else {
            reject(
              new Error(`Failed to fetch Pokemon: ${res.statusCode} ${data}`),
            );
          }
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

function transformPokemonData(rawPokemon: PokeApiPokemon) {
  const abilities = rawPokemon.abilities.map((a) => ({
    ability: a.ability.name,
    is_hidden: a.is_hidden,
    slot: a.slot,
  }));

  const types = rawPokemon.types.map((t) => ({
    type: t.type.name,
    slot: t.slot,
  }));

  const moves = rawPokemon.moves.map((m) => ({
    move: m.move.name,
    version_group_details: m.version_group_details.map((vg) => ({
      level_learned_at: vg.level_learned_at,
      move_learn_method: vg.move_learn_method.name,
      version_group: vg.version_group.name,
    })),
  }));

  const stats = rawPokemon.stats.map((s) => ({
    stat: s.stat.name,
    base_stat: s.base_stat,
    effort: s.effort,
  }));

  const species = rawPokemon.species?.name || null;
  const form = rawPokemon.forms?.[0]?.name || null;

  return {
    id: rawPokemon.id,
    name: rawPokemon.name,
    sprites: rawPokemon.sprites as Prisma.InputJsonValue,
    types: types as Prisma.InputJsonValue,
    height: rawPokemon.height,
    weight: rawPokemon.weight,
    moves: moves as Prisma.InputJsonValue,
    order: rawPokemon.order,
    species,
    stats: stats as Prisma.InputJsonValue,
    abilities: abilities as Prisma.InputJsonValue,
    form,
  };
}

async function importPokemon(idOrName: string) {
  try {
    console.log(`🔍 Fetching Pokemon "${idOrName}" from PokeAPI...`);

    const rawPokemon = await fetchPokemon(idOrName);

    // Download sprite images and get local paths
    console.log(`📥 Downloading images for ${rawPokemon.name}...`);
    const localSprites = await downloadPokemonSprites(
      rawPokemon.id,
      rawPokemon.sprites as Record<string, string | null>,
      uploadsDir,
    );

    const transformedData = transformPokemonData(rawPokemon);
    transformedData.sprites = localSprites as Prisma.InputJsonValue;

    console.log(
      `� Importing ${transformedData.name} (ID: ${transformedData.id})...`,
    );

    // Check if Pokemon already exists
    const existing = await prisma.pokemon.findUnique({
      where: { id: transformedData.id },
    });

    if (existing) {
      console.log(`⚠️  Pokemon already exists. Updating...`);
      await prisma.pokemon.update({
        where: { id: transformedData.id },
        data: transformedData,
      });
      console.log(`✅ Successfully updated ${transformedData.name}!`);
    } else {
      await prisma.pokemon.create({
        data: transformedData,
      });
      console.log(`✅ Successfully imported ${transformedData.name}!`);
    }

    // Display summary
    console.log(`\n📋 Summary:`);
    console.log(`   ID: ${transformedData.id}`);
    console.log(`   Name: ${transformedData.name}`);

    // Extract types from JSON for display
    const typesArray = transformedData.types as unknown as Array<{
      type: string;
      slot: number;
    }>;
    const typeNames = typesArray.map((t) => t.type).join(', ');
    console.log(`   Types: ${typeNames}`);
    console.log(`   Height: ${transformedData.height}`);
    console.log(`   Weight: ${transformedData.weight}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Error: ${error.message}`);
    } else {
      console.error(`❌ Unknown error occurred`);
    }
    process.exit(1);
  }
}

async function main() {
  const idOrName = process.argv[2];

  if (!idOrName) {
    console.error('❌ Error: Please provide a Pokemon ID or name');
    console.log('\nUsage:');
    console.log('  pnpm import-pokemon <id or name>');
    console.log('\nExamples:');
    console.log('  pnpm import-pokemon 25');
    console.log('  pnpm import-pokemon pikachu');
    console.log('  pnpm import-pokemon charizard');
    process.exit(1);
  }

  await importPokemon(idOrName);
}

main()
  .catch((e) => {
    console.error('❌ Unexpected error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
