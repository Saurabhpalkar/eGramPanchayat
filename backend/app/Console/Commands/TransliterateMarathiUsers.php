<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class TransliterateMarathiUsers extends Command
{
    protected $signature = 'users:transliterate-marathi';

    protected $description = 'Populate Marathi names for existing users';

    public function handle()
    {
        $users = User::whereNull('name_mr')->get();

        $this->info("Users found: " . $users->count());

        foreach ($users as $user) {

            $this->line(
                "User {$user->id}: {$user->name}"
            );

            // We will put transliteration logic here
        }

        $this->info('Done.');

        return Command::SUCCESS;
    }
}