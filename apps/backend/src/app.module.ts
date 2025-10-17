import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PokemonsModule } from './pokemons/pokemons.module';
import { TeamsModule } from './teams/teams.module';
import { configuration } from './config/configuration';
import { validateEnv } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnv,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    PrismaModule,
    PokemonsModule,
    TeamsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
