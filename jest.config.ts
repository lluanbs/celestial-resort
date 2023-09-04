import type { Config } from 'jest';

export default async (): Promise<Config> => {
    return {
        verbose: true,
        bail: 1,
        preset: 'ts-jest',
        displayName: "celestial-resort",
        testEnvironment: 'node',
    };
};