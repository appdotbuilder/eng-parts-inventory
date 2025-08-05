<?php

namespace Database\Seeders;

use App\Models\SparePart;
use App\Models\User;
use App\Models\UsageHistory;
use Illuminate\Database\Seeder;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);

        // Create technician users
        $technicians = User::factory()->technician()->count(3)->create();

        // Create spare parts
        $spareParts = SparePart::factory()->count(50)->create();

        // Create some low stock items
        SparePart::factory()->lowStock()->count(10)->create();

        // Create some out of stock items
        SparePart::factory()->outOfStock()->count(5)->create();

        // Create usage history
        $users = User::all();
        
        foreach ($spareParts->random(30) as $sparePart) {
            $usageCount = random_int(1, 5);
            
            for ($i = 0; $i < $usageCount; $i++) {
                $quantityUsed = random_int(1, min(5, $sparePart->quantity));
                
                if ($sparePart->quantity >= $quantityUsed) {
                    $quantityBefore = $sparePart->quantity;
                    $quantityAfter = $quantityBefore - $quantityUsed;
                    
                    UsageHistory::factory()->create([
                        'spare_part_id' => $sparePart->id,
                        'user_id' => $users->random()->id,
                        'quantity_used' => $quantityUsed,
                        'quantity_before' => $quantityBefore,
                        'quantity_after' => $quantityAfter,
                    ]);
                    
                    // Update spare part quantity
                    $sparePart->quantity = $quantityAfter;
                    $sparePart->save();
                }
            }
        }
    }
}