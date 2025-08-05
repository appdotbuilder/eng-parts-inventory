<?php

namespace Database\Factories;

use App\Models\SparePart;
use App\Models\User;
use App\Models\UsageHistory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UsageHistory>
 */
class UsageHistoryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\UsageHistory>
     */
    protected $model = UsageHistory::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $purposes = [
            'Routine Maintenance',
            'Emergency Repair',
            'Preventive Maintenance',
            'System Upgrade',
            'Replacement',
            'Installation',
            'Troubleshooting',
        ];

        $quantityUsed = $this->faker->numberBetween(1, 10);
        $quantityBefore = $this->faker->numberBetween($quantityUsed, 100);
        $quantityAfter = $quantityBefore - $quantityUsed;

        return [
            'spare_part_id' => SparePart::factory(),
            'user_id' => User::factory(),
            'quantity_used' => $quantityUsed,
            'quantity_before' => $quantityBefore,
            'quantity_after' => $quantityAfter,
            'purpose' => $this->faker->randomElement($purposes),
            'work_order' => 'WO-' . $this->faker->numberBetween(1000, 9999),
            'notes' => $this->faker->optional(0.7)->sentence(),
        ];
    }
}