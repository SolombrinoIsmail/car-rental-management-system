'use client';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  Textarea,
  Badge,
  Container,
  Separator,
  Checkbox,
  RadioGroup,
  FormField,
  Grid,
  Stack,
  DataTable,
  ThemeToggle,
} from '@swiss-car-rental/ui';
import { useState } from 'react';

const sampleTableData = [
  { id: 1, name: 'BMW 3 Series', category: 'Sedan', price: 'CHF 120/day', status: 'Available' },
  { id: 2, name: 'Audi Q5', category: 'SUV', price: 'CHF 180/day', status: 'Rented' },
  { id: 3, name: 'Mercedes C-Class', category: 'Sedan', price: 'CHF 150/day', status: 'Available' },
  { id: 4, name: 'VW Golf', category: 'Compact', price: 'CHF 90/day', status: 'Maintenance' },
];

interface VehicleData {
  id: number;
  name: string;
  category: string;
  price: string;
  status: string;
}

const tableColumns = [
  { key: 'name', header: 'Vehicle' },
  { key: 'category', header: 'Category' },
  { key: 'price', header: 'Price', align: 'right' as const },
  {
    key: 'status',
    header: 'Status',
    accessor: (row: VehicleData) => (
      <Badge
        variant={
          row.status === 'Available' ? 'default' : row.status === 'Rented' ? 'secondary' : 'outline'
        }
      >
        {row.status}
      </Badge>
    ),
  },
];

export default function UIDemo() {
  const [formData, setFormData] = useState({
    email: '',
    message: '',
    vehicle: '',
    terms: false,
    rental: 'daily',
  });

  return (
    <Container size="xl" className="py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">UI Component Library</h1>
        <ThemeToggle />
      </div>

      <p className="mb-8 text-lg text-muted-foreground">
        Swiss-inspired UI components built with Tailwind CSS and shadcn/ui
      </p>

      <Grid cols={2} gap="lg" className="mb-12">
        {/* Buttons Section */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Various button styles and states</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack direction="row" wrap gap="sm">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </Stack>
            <Separator className="my-4" />
            <Stack direction="row" gap="sm">
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Badges Section */}
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Status indicators and labels</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack direction="row" wrap gap="sm">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </Stack>
            <Separator className="my-4" />
            <Stack direction="row" gap="sm">
              <Badge className="bg-swiss-red">Swiss Red</Badge>
              <Badge variant="outline">CHF 99</Badge>
              <Badge variant="secondary">In Progress</Badge>
            </Stack>
          </CardContent>
        </Card>

        {/* Form Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Form Controls</CardTitle>
            <CardDescription>Input fields and form elements</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack gap="md">
              <FormField label="Email Address" required>
                <Input
                  type="email"
                  placeholder="john@example.ch"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </FormField>

              <FormField label="Vehicle Type">
                <Select
                  placeholder="Select a vehicle"
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                >
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="compact">Compact</option>
                  <option value="luxury">Luxury</option>
                </Select>
              </FormField>

              <FormField label="Special Requests" helperText="Optional notes for your rental">
                <Textarea
                  placeholder="Any special requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </FormField>

              <Checkbox
                label="I agree to the terms and conditions"
                checked={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Radio Groups */}
        <Card>
          <CardHeader>
            <CardTitle>Selection Options</CardTitle>
            <CardDescription>Radio groups and checkboxes</CardDescription>
          </CardHeader>
          <CardContent>
            <Stack gap="md">
              <div>
                <Label className="mb-2 block">Rental Period</Label>
                <RadioGroup
                  name="rental"
                  value={formData.rental}
                  onChange={(value) => setFormData({ ...formData, rental: value })}
                  options={[
                    { value: 'hourly', label: 'Hourly' },
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                  ]}
                />
              </div>

              <Separator />

              <div>
                <Label className="mb-2 block">Additional Services</Label>
                <Stack gap="sm">
                  <Checkbox label="GPS Navigation (+CHF 15/day)" />
                  <Checkbox label="Child Seat (+CHF 10/day)" />
                  <Checkbox label="Additional Driver (+CHF 25/day)" />
                  <Checkbox label="Full Insurance (+CHF 35/day)" />
                </Stack>
              </div>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Data Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Vehicle Fleet</CardTitle>
          <CardDescription>Available vehicles with pricing and status</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={tableColumns} data={sampleTableData} onRowClick={() => {}} />
        </CardContent>
      </Card>

      {/* Layout Components */}
      <Card>
        <CardHeader>
          <CardTitle>Layout Components</CardTitle>
          <CardDescription>Grid and Stack layout utilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label className="mb-2 block">Grid Layout (3 columns)</Label>
            <Grid cols={3} gap="md">
              <div className="rounded-md bg-muted p-4 text-center">Column 1</div>
              <div className="rounded-md bg-muted p-4 text-center">Column 2</div>
              <div className="rounded-md bg-muted p-4 text-center">Column 3</div>
            </Grid>
          </div>

          <Separator className="my-6" />

          <div>
            <Label className="mb-2 block">Stack Layout (Horizontal)</Label>
            <Stack direction="row" gap="md" justify="between" className="rounded-md bg-muted p-4">
              <div>Left</div>
              <div>Center</div>
              <div>Right</div>
            </Stack>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Components are fully responsive and support dark mode
          </p>
        </CardFooter>
      </Card>
    </Container>
  );
}
