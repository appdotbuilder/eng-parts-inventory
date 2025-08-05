<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\SparePart
 *
 * @property int $id
 * @property string $name
 * @property string $code
 * @property int $quantity
 * @property int $min_quantity
 * @property float $price
 * @property string|null $description
 * @property string|null $location
 * @property string|null $supplier
 * @property string|null $category
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\UsageHistory> $usageHistory
 * @property-read int|null $usage_history_count
 * @property-read bool $is_low_stock
 * @property-read string $status
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|SparePart newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SparePart newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SparePart query()
 * @method static \Illuminate\Database\Eloquent\Builder|SparePart whereCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SparePart whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SparePart whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SparePart whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SparePart whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SparePart whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SparePart whereMinQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SparePart whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SparePart wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SparePart whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SparePart whereSupplier($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SparePart whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SparePart lowStock()
 * @method static \Database\Factories\SparePartFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class SparePart extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'code',
        'quantity',
        'min_quantity',
        'price',
        'description',
        'location',
        'supplier',
        'category',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'quantity' => 'integer',
        'min_quantity' => 'integer',
        'price' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'is_low_stock',
        'status',
    ];

    /**
     * Get the usage history for this spare part.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function usageHistory(): HasMany
    {
        return $this->hasMany(UsageHistory::class);
    }

    /**
     * Scope a query to only include low stock items.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeLowStock($query)
    {
        return $query->whereColumn('quantity', '<=', 'min_quantity');
    }

    /**
     * Check if the spare part is low on stock.
     *
     * @return bool
     */
    public function getIsLowStockAttribute(): bool
    {
        return $this->quantity <= $this->min_quantity;
    }

    /**
     * Get the status of the spare part.
     *
     * @return string
     */
    public function getStatusAttribute(): string
    {
        if ($this->quantity === 0) {
            return 'Out of Stock';
        } elseif ($this->is_low_stock) {
            return 'Low Stock';
        } else {
            return 'In Stock';
        }
    }

    /**
     * Reduce the quantity of the spare part.
     *
     * @param int $amount
     * @return bool
     */
    public function reduceQuantity(int $amount): bool
    {
        if ($this->quantity >= $amount) {
            $this->quantity -= $amount;
            return $this->save();
        }
        return false;
    }

    /**
     * Increase the quantity of the spare part.
     *
     * @param int $amount
     * @return bool
     */
    public function increaseQuantity(int $amount): bool
    {
        $this->quantity += $amount;
        return $this->save();
    }
}