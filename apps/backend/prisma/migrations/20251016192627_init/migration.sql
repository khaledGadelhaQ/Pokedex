-- CreateTable
CREATE TABLE "pokemons" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sprites" JSONB NOT NULL,
    "types" JSONB NOT NULL,
    "height" INTEGER,
    "weight" INTEGER,
    "moves" JSONB,
    "order" INTEGER,
    "species" TEXT,
    "stats" JSONB,
    "abilities" JSONB,
    "form" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pokemons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_pokemons" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "pokemon_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_pokemons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pokemons_name_key" ON "pokemons"("name");

-- CreateIndex
CREATE UNIQUE INDEX "team_pokemons_team_id_pokemon_id_key" ON "team_pokemons"("team_id", "pokemon_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_pokemons_team_id_position_key" ON "team_pokemons"("team_id", "position");

-- AddForeignKey
ALTER TABLE "team_pokemons" ADD CONSTRAINT "team_pokemons_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_pokemons" ADD CONSTRAINT "team_pokemons_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "pokemons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
