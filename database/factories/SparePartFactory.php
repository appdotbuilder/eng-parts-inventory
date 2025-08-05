<?php

namespace Database\Factories;

use App\Models\SparePart;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SparePart>
 */
class SparePartFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\SparePart>
     */
    protected $model = SparePart::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            'Bearings',
            'Seals',
            'Belts',
            'Filters',
            'Gaskets',
            'Motors',
            'Sensors',
            'Valves',
            'Pumps',
            'Electrical',
        ];

        $suppliers = [
            'ABC Engineering Supplies',
            'TechParts Inc.',
            'Industrial Solutions Ltd.',
            'MechSupply Co.',
            'Parts Direct',
        ];

        $locations = [
            'Warehouse A - Shelf 1',
            'Warehouse A - Shelf 2',
            'Warehouse B - Shelf 1',
            'Storage Room C',
            'Main Inventory',
        ];

        $quantity = $this->faker->numberBetween(0, 100);
        $minQuantity = $this->faker->numberBetween(5, 20);

        return [
            'name' => $this->faker->words(3, true) . ' ' . $this->faker->randomElement(['Part', 'Component', 'Assembly']),
            'code' => strtoupper($this->faker->bothify('??##-####')),
            'quantity' => $quantity,
            'min_quantity' => $minQuantity,
            'price' => $this->faker->randomFloat(2, 5, 500),
            'description' => $this->faker->sentence(10),
            'location' => $this->faker->randomElement($locations),
            'supplier' => $this->faker->randomElement($suppliers),
            'category' => $this->faker->randomElement($categories),
        ];
    }

    /**
     * Indicate that the spare part is low on stock.
     */
    public function lowStock(): static
    {
        return $this->state(function (array $attributes) {
            $minQuantity = $this->faker->numberBetween(10, 20);
            return [
                'quantity' => $this->faker->numberBetween(0, $minQuantity),
                'min_quantity' => $minQuantity,
            ];
        });
    }

    /**
     * Indicate that the spare part is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'quantity' => 0,
                'min_quantity' => $this->faker->numberBetween(5, 20),
            ];
        });
    }
}