import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, DollarSign, Calendar, Percent } from "lucide-react";
import { CostBreakdown } from './CostBreakdown';

interface MortgageCalculatorProps {
  compact?: boolean;
}

interface CalculationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  stampDuty: number;
  legalFees: number;
  valuationFees: number;
  mrtaInsurance: number;
  totalUpfront: number;
}

export const MortgageCalculator = ({ compact = false }: MortgageCalculatorProps) => {
  const [loanAmount, setLoanAmount] = useState<string>('500000');
  const [interestRate, setInterestRate] = useState<string>('4.5');
  const [tenure, setTenure] = useState<string>('30');
  const [propertyValue, setPropertyValue] = useState<string>('600000');
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Calculate mortgage payments using standard amortization formula
  const calculateMortgage = () => {
    const principal = parseFloat(loanAmount) || 0;
    const rate = (parseFloat(interestRate) || 0) / 100 / 12; // Monthly interest rate
    const payments = (parseFloat(tenure) || 0) * 12; // Total payments
    const propValue = parseFloat(propertyValue) || 0;

    if (principal <= 0 || rate <= 0 || payments <= 0) {
      setResult(null);
      return;
    }

    // Monthly payment calculation
    const monthlyPayment = principal * (rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1);
    const totalPayment = monthlyPayment * payments;
    const totalInterest = totalPayment - principal;

    // Malaysia-specific cost calculations
    const stampDuty = calculateStampDuty(propValue);
    const legalFees = calculateLegalFees(propValue);
    const valuationFees = Math.min(propValue * 0.0025, 2500); // Capped at RM2,500
    const mrtaInsurance = principal * 0.006; // Approximate MRTA cost

    const totalUpfront = stampDuty + legalFees + valuationFees + mrtaInsurance;

    setResult({
      monthlyPayment,
      totalPayment,
      totalInterest,
      stampDuty,
      legalFees,
      valuationFees,
      mrtaInsurance,
      totalUpfront
    });
  };

  // Malaysia stamp duty calculation (progressive rates)
  const calculateStampDuty = (value: number) => {
    let duty = 0;
    
    if (value <= 100000) {
      duty = value * 0.01;
    } else if (value <= 500000) {
      duty = 1000 + (value - 100000) * 0.02;
    } else if (value <= 1000000) {
      duty = 9000 + (value - 500000) * 0.03;
    } else {
      duty = 24000 + (value - 1000000) * 0.04;
    }
    
    return duty;
  };

  // Malaysia legal fees calculation (simplified progressive scale)
  const calculateLegalFees = (value: number) => {
    let fees = 0;
    
    if (value <= 150000) {
      fees = 1000 + value * 0.01;
    } else if (value <= 1000000) {
      fees = 2500 + (value - 150000) * 0.008;
    } else {
      fees = 9300 + (value - 1000000) * 0.007;
    }
    
    return Math.max(fees, 500); // Minimum fee
  };

  useEffect(() => {
    if (loanAmount && interestRate && tenure && propertyValue) {
      calculateMortgage();
    }
  }, [loanAmount, interestRate, tenure, propertyValue]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
        <div className="space-y-2">
          <Label htmlFor="property-value" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            Property Value (RM)
          </Label>
          <Input
            id="property-value"
            type="number"
            value={propertyValue}
            onChange={(e) => setPropertyValue(e.target.value)}
            placeholder="600000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="loan-amount" className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-primary" />
            Loan Amount (RM)
          </Label>
          <Input
            id="loan-amount"
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="500000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interest-rate" className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-accent" />
            Interest Rate (%)
          </Label>
          <Input
            id="interest-rate"
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="4.5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tenure" className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            Tenure (years)
          </Label>
          <Input
            id="tenure"
            type="number"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            placeholder="30"
          />
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-4`}>
            <Card className="bg-gradient-primary text-primary-foreground">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm opacity-90">Monthly Payment</p>
                  <p className="text-2xl font-bold">{formatCurrency(result.monthlyPayment)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-accent text-accent-foreground">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm opacity-90">Total Interest</p>
                  <p className="text-xl font-bold">{formatCurrency(result.totalInterest)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Payment</p>
                  <p className="text-xl font-bold">{formatCurrency(result.totalPayment)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {!compact && (
            <CostBreakdown 
              stampDuty={result.stampDuty}
              legalFees={result.legalFees}
              valuationFees={result.valuationFees}
              mrtaInsurance={result.mrtaInsurance}
              totalUpfront={result.totalUpfront}
            />
          )}
        </div>
      )}

      {compact && result && (
        <div className="text-center pt-4">
          <Badge variant="outline" className="text-xs">
            Upfront: {formatCurrency(result.totalUpfront)}
          </Badge>
        </div>
      )}
    </div>
  );
};