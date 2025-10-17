import { PrismaClient, Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { PokeApiPokemon } from './types/pokeapi.types';

const prisma = new PrismaClient();

function transformPokemonData(rawPokemon: PokeApiPokemon) {
  // Transform abilities: extract just the ability name and other needed fields
  const abilities = rawPokemon.abilities.map((a) => ({
    ability: a.ability.name,
    is_hidden: a.is_hidden,
    slot: a.slot,
  }));

  // Transform types: extract just the type name and slot
  const types = rawPokemon.types.map((t) => ({
    type: t.type.name,
    slot: t.slot,
  }));

  // Transform moves: extract move name and version group details
  const moves = rawPokemon.moves.map((m) => ({
    move: m.move.name,
    version_group_details: m.version_group_details.map((vg) => ({
      level_learned_at: vg.level_learned_at,
      move_learn_method: vg.move_learn_method.name,
      version_group: vg.version_group.name,
    })),
  }));

  // Transform stats: extract stat name, base_stat, and effort
  const stats = rawPokemon.stats.map((s) => ({
    stat: s.stat.name,
    base_stat: s.base_stat,
    effort: s.effort,
  }));

  // Extract species name
  const species = rawPokemon.species?.name || null;

  // Extract form name
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

async function main() {
  console.log('🌱 Starting database seed...');

  // Path to the pokemons.json file in the root directory
  const pokemonsFilePath = path.join(__dirname, '../../../pokemons.json');

  console.log('📂 Reading pokemons.json...');
  const rawData = fs.readFileSync(pokemonsFilePath, 'utf-8');
  const pokemons = JSON.parse(rawData) as PokeApiPokemon[];

  console.log(`📊 Found ${pokemons.length} Pokemon to seed`);

  // Delete existing Pokemon data
  console.log('🗑️  Clearing existing Pokemon data...');
  await prisma.teamPokemon.deleteMany({});
  await prisma.pokemon.deleteMany({});

  console.log('💾 Seeding Pokemon...');
  let count = 0;

  for (const rawPokemon of pokemons) {
    const transformedData = transformPokemonData(rawPokemon);

    await prisma.pokemon.create({
      data: transformedData,
    });

    count++;
    if (count % 10 === 0) {
      console.log(`  ✓ Seeded ${count}/${pokemons.length} Pokemon`);
    }
  }

  console.log(`✅ Successfully seeded ${count} Pokemon!`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
