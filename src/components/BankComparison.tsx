import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, TrendingDown, TrendingUp, Star } from "lucide-react";

interface BankPackage {
  id: string;
  bankName: string;
  packageName: string;
  interestRate: number;
  lockInPeriod: number;
  minIncome: number;
  maxLTV: number;
  features: string[];
  color: string;
}

const malaysiaBanks: BankPackage[] = [
  {
    id: 'maybank',
    bankName: 'Maybank',
    packageName: 'Home Loan-i',
    interestRate: 4.25,
    lockInPeriod: 3,
    minIncome: 3000,
    maxLTV: 90,
    features: ['BRR + 1.75%', 'Flexible payment', 'Online application'],
    color: 'bg-yellow-500'
  },
  {
    id: 'cimb',
    bankName: 'CIMB',
    packageName: 'Conventional Home Loan',
    interestRate: 4.35,
    lockInPeriod: 5,
    minIncome: 3000,
    maxLTV: 90,
    features: ['BLR - 2.00%', 'No early settlement penalty after lock-in', 'Free valuation'],
    color: 'bg-red-500'
  },
  {
    id: 'public-bank',
    bankName: 'Public Bank',
    packageName: 'PB Home Loan',
    interestRate: 4.15,
    lockInPeriod: 3,
    minIncome: 2500,
    maxLTV: 95,
    features: ['BLR - 2.10%', 'Lower minimum income', 'Higher LTV ratio'],
    color: 'bg-blue-500'
  },
  {
    id: 'rhb',
    bankName: 'RHB Bank',
    packageName: 'Smart Home Loan',
    interestRate: 4.40,
    lockInPeriod: 2,
    minIncome: 3500,
    maxLTV: 90,
    features: ['BRR + 1.85%', 'Shortest lock-in period', 'Cashback promotion'],
    color: 'bg-green-500'
  }
];

export const BankComparison = () => {
  const [loanAmount, setLoanAmount] = useState<string>('500000');
  const [tenure, setTenure] = useState<string>('30');
  const [selectedBanks, setSelectedBanks] = useState<string[]>(['maybank', 'cimb', 'public-bank']);
  const [calculations, setCalculations] = useState<{[key: string]: {
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
  }}>({});

  const calculateLoan = (principal: number, rate: number, years: number) => {
    const monthlyRate = rate / 100 / 12;
    const payments = years * 12;
    
    if (monthlyRate === 0) {
      return {
        monthlyPayment: principal / payments,
        totalPayment: principal,
        totalInterest: 0
      };
    }

    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1);
    const totalPayment = monthlyPayment * payments;
    const totalInterest = totalPayment - principal;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest
    };
  };

  useEffect(() => {
    const principal = parseFloat(loanAmount) || 0;
    const years = parseFloat(tenure) || 0;

    if (principal > 0 && years > 0) {
      const newCalculations: {[key: string]: any} = {};
      
      selectedBanks.forEach(bankId => {
        const bank = malaysiaBanks.find(b => b.id === bankId);
        if (bank) {
          newCalculations[bankId] = calculateLoan(principal, bank.interestRate, years);
        }
      });

      setCalculations(newCalculations);
    }
  }, [loanAmount, tenure, selectedBanks]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleBankToggle = (bankId: string) => {
    setSelectedBanks(prev => {
      if (prev.includes(bankId)) {
        return prev.filter(id => id !== bankId);
      } else if (prev.length < 3) {
        return [...prev, bankId];
      }
      return prev;
    });
  };

  const getBestRate = () => {
    const rates = selectedBanks.map(id => malaysiaBanks.find(b => b.id === id)?.interestRate).filter(Boolean);
    return Math.min(...rates as number[]);
  };

  const bestRate = getBestRate();

  return (
    <div className="space-y-6">
      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="comparison-loan-amount">Loan Amount (RM)</Label>
          <Input
            id="comparison-loan-amount"
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="500000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="comparison-tenure">Tenure (years)</Label>
          <Input
            id="comparison-tenure"
            type="number"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            placeholder="30"
          />
        </div>
      </div>

      {/* Bank Selection */}
      <div className="space-y-3">
        <Label>Select Banks to Compare (max 3)</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {malaysiaBanks.map(bank => (
            <Button
              key={bank.id}
              variant={selectedBanks.includes(bank.id) ? "default" : "outline"}
              size="sm"
              onClick={() => handleBankToggle(bank.id)}
              disabled={!selectedBanks.includes(bank.id) && selectedBanks.length >= 3}
              className="justify-start"
            >
              <Building className="w-4 h-4 mr-2" />
              {bank.bankName}
            </Button>
          ))}
        </div>
      </div>

      {/* Comparison Results */}
      {selectedBanks.length > 0 && Object.keys(calculations).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedBanks.map(bankId => {
            const bank = malaysiaBanks.find(b => b.id === bankId);
            const calc = calculations[bankId];
            
            if (!bank || !calc) return null;

            const isBestRate = bank.interestRate === bestRate;

            return (
              <Card key={bankId} className={`relative shadow-card ${isBestRate ? 'ring-2 ring-accent' : ''}`}>
                {isBestRate && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Best Rate
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${bank.color}`} />
                    {bank.bankName}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{bank.packageName}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Interest Rate */}
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{bank.interestRate}%</p>
                    <p className="text-xs text-muted-foreground">Interest Rate</p>
                  </div>

                  {/* Monthly Payment */}
                  <div className="bg-gradient-background p-3 rounded-lg text-center">
                    <p className="text-lg font-bold">{formatCurrency(calc.monthlyPayment)}</p>
                    <p className="text-xs text-muted-foreground">Monthly Payment</p>
                  </div>

                  {/* Key Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Interest:</span>
                      <span className="font-medium">{formatCurrency(calc.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lock-in Period:</span>
                      <span className="font-medium">{bank.lockInPeriod} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Min Income:</span>
                      <span className="font-medium">{formatCurrency(bank.minIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max LTV:</span>
                      <span className="font-medium">{bank.maxLTV}%</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Key Features:</p>
                    <div className="space-y-1">
                      {bank.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs mr-1 mb-1">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedBanks.length > 1 && Object.keys(calculations).length > 1 && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Comparison Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Lowest Interest</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{bestRate}%</p>
              </div>
              
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="font-medium">Rate Range</span>
                </div>
                <p className="text-lg font-bold">
                  {Math.min(...selectedBanks.map(id => malaysiaBanks.find(b => b.id === id)?.interestRate || 0))}% - {Math.max(...selectedBanks.map(id => malaysiaBanks.find(b => b.id === id)?.interestRate || 0))}%
                </p>
              </div>

              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Building className="w-5 h-5 text-accent" />
                  <span className="font-medium">Comparing</span>
                </div>
                <p className="text-lg font-bold">{selectedBanks.length} Banks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
        <p className="font-medium mb-1">📋 Comparison Notes:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Interest rates are indicative and may vary based on your profile</li>
          <li>BLR = Base Lending Rate, BRR = Base Rate Reference</li>
          <li>Lock-in period is the minimum duration before early settlement is allowed</li>
          <li>LTV = Loan-to-Value ratio (maximum percentage of property value that can be financed)</li>
          <li>Always check with banks for the latest rates and promotions</li>
        </ul>
      </div>
    </div>
  );
};