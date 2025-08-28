import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Users, TrendingUp, MapPin } from "lucide-react";
import { MortgageCalculator } from "@/components/MortgageCalculator";
import { AffordabilityChecker } from "@/components/AffordabilityChecker";
import { BankComparison } from "@/components/BankComparison";

const Index = () => {
  const [activeTab, setActiveTab] = useState("buyers");

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="bg-gradient-primary shadow-fintech">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">
                MortgageMY
              </h1>
              <p className="text-primary-foreground/80 text-sm md:text-base">
                Malaysia's Smart Mortgage Planning Platform
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="hidden md:flex">
                <MapPin className="w-3 h-3 mr-1" />
                Malaysia
              </Badge>
              <Badge variant="outline" className="text-primary-foreground border-primary-foreground/30">
                v1.0
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="buyers" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">For Homebuyers</span>
              <span className="sm:hidden">Buyers</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">For Agents</span>
              <span className="sm:hidden">Agents</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buyers" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Plan Your Home Purchase
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Calculate your mortgage, understand Malaysia-specific costs, and make informed decisions about your home purchase.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mortgage Calculator */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    Mortgage Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate your monthly payments and total costs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MortgageCalculator />
                </CardContent>
              </Card>

              {/* Affordability Checker */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    Affordability Check
                  </CardTitle>
                  <CardDescription>
                    See how much house you can afford based on your income
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AffordabilityChecker />
                </CardContent>
              </Card>
            </div>

            {/* Bank Comparison */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Compare Bank Packages</CardTitle>
                <CardDescription>
                  Compare different banks' mortgage offers side by side
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BankComparison />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Agent Tools & Reports
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Generate professional reports and help your clients make informed decisions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Quick Calculator</CardTitle>
                  <CardDescription>
                    Fast calculations during viewings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MortgageCalculator compact />
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Client Reports</CardTitle>
                  <CardDescription>
                    Generate branded PDF reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-accent-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Coming Soon
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>WhatsApp Share</CardTitle>
                  <CardDescription>
                    Share calculations instantly
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Coming Soon
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-fintech-dark text-fintech-gray py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Built for Malaysia's property market. All calculations are estimates and should be verified with financial institutions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;