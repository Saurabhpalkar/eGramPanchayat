<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicationFactory extends Factory
{
    public function definition(): array
    {
        $appliedDate = fake()->dateTimeBetween('-6 months', 'now');
        $dueDate = (clone $appliedDate)->modify('+7 days');

        return [
            'application_no' => 'APP' . fake()->unique()->numerify('######'),

            // Random existing user
            'user_id' => User::inRandomOrder()->value('id'),

            // Random existing service
            'service_id' => Service::inRandomOrder()->value('id'),

            'status' => fake()->randomElement([
                'pending',
                'approved',
                'rejected',
                'in_progress'
            ]),

            'applied_date' => $appliedDate->format('Y-m-d'),
            'due_date' => $dueDate->format('Y-m-d'),

            'approved_date' => fake()->optional()->dateTimeBetween($appliedDate, 'now')?->format('Y-m-d'),

            'remarks' => fake()->optional()->sentence(),
        ];
    }
}