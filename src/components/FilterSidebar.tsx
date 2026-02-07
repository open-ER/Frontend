import { FilterState, BrandCount } from '../types/product';
import { priceRanges } from '../data/products';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  brandCounts: BrandCount[];
  onResetFilters: () => void;
}

export function FilterSidebar({ 
  filters, 
  onFiltersChange, 
  brandCounts, 
  onResetFilters 
}: FilterSidebarProps) {
  const handlePriceRangeChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: [values[0], values[1]]
    });
  };

  const handlePredefinedRangeClick = (min: number, max: number) => {
    onFiltersChange({
      ...filters,
      priceRange: [min, max]
    });
  };

  const handleBrandToggle = (brand: string) => {
    const updatedBrands = filters.selectedBrands.includes(brand)
      ? filters.selectedBrands.filter(b => b !== brand)
      : [...filters.selectedBrands, brand];
    
    onFiltersChange({
      ...filters,
      selectedBrands: updatedBrands
    });
  };

  return (
    <div className="w-80 bg-card border-r p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2>Filters</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onResetFilters}
          className="text-sm"
        >
          Reset Filters
        </Button>
      </div>

      <Separator />

      {/* Price Filter */}
      <div className="space-y-4">
        <h3>Price Range</h3>
        
        {/* Slider */}
        <div className="space-y-4">
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={handlePriceRangeChange}
              max={300}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>

        {/* Predefined Ranges */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Quick Select:</p>
          <div className="grid grid-cols-2 gap-2">
            {priceRanges.map((range, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handlePredefinedRangeClick(range.min, range.max)}
                className="text-xs h-8"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      {/* Brand Filter */}
      <div className="space-y-4">
        <h3>Luxury Brands</h3>
        <div className="space-y-3">
          {brandCounts.map((brandCount) => (
            <div key={brandCount.brand} className="flex items-center space-x-3">
              <Checkbox
                id={brandCount.brand}
                checked={filters.selectedBrands.includes(brandCount.brand)}
                onCheckedChange={() => handleBrandToggle(brandCount.brand)}
              />
              <label 
                htmlFor={brandCount.brand}
                className="flex-1 text-sm cursor-pointer flex items-center justify-between"
              >
                <span>{brandCount.brand}</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {brandCount.count}
                </Badge>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}