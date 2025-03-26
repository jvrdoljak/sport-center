import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1"

  },
  testEnvironment: 'node',
};

export default config;