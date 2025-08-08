'use client';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ThemeToggle,
} from '@swiss-car-rental/ui';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="z-10 w-full max-w-5xl">
        <h1 className="mb-4 text-center text-5xl font-bold">Swiss Car Rental Management</h1>
        <p className="mb-12 text-center text-xl text-muted-foreground">
          Enterprise-grade vehicle rental platform built for Switzerland
        </p>

        <div className="mb-12 flex items-center justify-center gap-4">
          <Button size="lg" className="bg-swiss-red hover:bg-swiss-red/90">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
          <Link href="/ui-demo">
            <Button variant="secondary" size="lg">
              View UI Components
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>🚗 Fleet Management</CardTitle>
              <CardDescription>Comprehensive vehicle tracking and maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage your entire fleet with real-time tracking, maintenance schedules, and
                availability monitoring.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📊 Analytics & Reports</CardTitle>
              <CardDescription>Data-driven insights for your business</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track performance metrics, revenue analysis, and customer behavior with
                comprehensive reporting.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🇨🇭 Swiss Compliance</CardTitle>
              <CardDescription>Built for Swiss regulations and standards</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Fully compliant with Swiss data protection laws and business regulations.
                Multi-language support included.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
