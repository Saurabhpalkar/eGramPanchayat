<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),

            'email' => fake()->unique()->safeEmail(),

            // Starts with 9 and creates a 10-digit mobile number
            'mobile' => fake()->unique()->numerify('9#########'),

            // 12-digit Aadhaar number
            'aadhaar_number' => fake()->unique()->numerify('############'),

            // Ward 1 to 5
            'ward_id' => fake()->numberBetween(1, 5),

            'gender' => fake()->randomElement([
                'male',
                'female',
                'other'
            ]),

            // Citizen age between 18 and 80
            'dob' => fake()->dateTimeBetween('-80 years', '-18 years')
                           ->format('Y-m-d'),

            // Will be hashed automatically by the model cast
            'password' => 'password',
        ];

    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
