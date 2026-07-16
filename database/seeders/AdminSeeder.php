<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        User::create([
            'name' => 'Admin',
            'username' => 'admin',
            'email' => 'kinghos1234@gmail.com',
            'phone' => '081287724524',
            'password' => Hash::make('admintalentgroup'),
            'role_id' => 1,
            'email_verified_at' => now(),
        ]);
    }
}
