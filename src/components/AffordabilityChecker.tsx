import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Home, AlertCircle } from "lucide-react";

export const AffordabilityChecker = () => {
  const [monthlyIncome, setMonthlyIncome] = useState<string>('8000');
  const [monthlyCommitments, setMonthlyCommitments] = useState<string>('2000');
  const [interestRate, setInterestRate] = useState<string>('4.5');
  const [tenure, setTenure] = useState<string>('30');
  const [result, setResult] = useState<{
    maxLoanAmount: number;
    maxPropertyValue: number;
    monthlyPayment: number;
    dsr: number;
  } | null>(null);

  const calculateAffordability = () => {
    const income = parseFloat(monthlyIncome) || 0;
    const commitments = parseFloat(monthlyCommitments) || 0;
    const rate = (parseFloat(interestRate) || 0) / 100 / 12;
    const payments = (parseFloat(tenure) || 0) * 12;

    if (income <= 0 || rate <= 0 || payments <= 0) {
      setResult(null);
      return;
    }

    // DSR (Debt Service Ratio) - Malaysian banks typically allow max 35%
    const maxDSR = 0.35;
    const availableForLoan = (income * maxDSR) - commitments;
    
    if (availableForLoan <= 0) {
      setResult({
        maxLoanAmount: 0,
        maxPropertyValue: 0,
        monthlyPayment: 0,
        dsr: (commitments / income) * 100
      });
      return;
    }

    // Calculate maximum loan amount using reverse mortgage calculation
    const maxLoanAmount = availableForLoan * (Math.pow(1 + rate, payments) - 1) / (rate * Math.pow(1 + rate, payments));
    
    // Assuming 90% LTV (Loan-to-Value) ratio for property value
    const maxPropertyValue = maxLoanAmount / 0.9;
    
    const currentDSR = ((commitments + availableForLoan) / income) * 100;

    setResult({
      maxLoanAmount,
      maxPropertyValue,
      monthlyPayment: availableForLoan,
      dsr: currentDSR
    });
  };

  useEffect(() => {
    if (monthlyIncome && interestRate && tenure) {
      calculateAffordability();
    }
  }, [monthlyIncome, monthlyCommitments, interestRate, tenure]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDSRStatus = (dsr: number) => {
    if (dsr <= 30) return { label: "Excellent", color: "bg-green-500" };
    if (dsr <= 35) return { label: "Good", color: "bg-yellow-500" };
    return { label: "High Risk", color: "bg-red-500" };
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="monthly-income" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-accent" />
            Monthly Gross Income (RM)
          </Label>
          <Input
            id="monthly-income"
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            placeholder="8000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthly-commitments" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            Monthly Commitments (RM)
          </Label>
          <Input
            id="monthly-commitments"
            type="number"
            value={monthlyCommitments}
            onChange={(e) => setMonthlyCommitments(e.target.value)}
            placeholder="2000"
          />
          <p className="text-xs text-muted-foreground">
            Include car loans, personal loans, credit cards, etc.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="afford-rate">Interest Rate (%)</Label>
            <Input
              id="afford-rate"
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="4.5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="afford-tenure">Tenure (years)</Label>
            <Input
              id="afford-tenure"
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              placeholder="30"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {result.maxLoanAmount > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-primary text-primary-foreground">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Home className="w-6 h-6 mx-auto mb-2 opacity-90" />
                      <p className="text-sm opacity-90">Max Property Value</p>
                      <p className="text-xl font-bold">{formatCurrency(result.maxPropertyValue)}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-accent text-accent-foreground">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <TrendingUp className="w-6 h-6 mx-auto mb-2 opacity-90" />
                      <p className="text-sm opacity-90">Max Loan Amount</p>
                      <p className="text-xl font-bold">{formatCurrency(result.maxLoanAmount)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-2 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Debt Service Ratio (DSR)</p>
                      <p className="text-2xl font-bold">{result.dsr.toFixed(1)}%</p>
                    </div>
                    <Badge className={`${getDSRStatus(result.dsr).color} text-white`}>
                      {getDSRStatus(result.dsr).label}
                    </Badge>
                  </div>
                  <div className="mt-2 bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${getDSRStatus(result.dsr).color}`}
                      style={{ width: `${Math.min(result.dsr, 50)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-2 border-red-200 bg-red-50">
              <CardContent className="p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-700 mb-2">
                  Current commitments too high
                </h3>
                <p className="text-red-600 text-sm">
                  Your existing monthly commitments exceed the recommended DSR. 
                  Consider reducing existing debts before applying for a mortgage.
                </p>
                <p className="text-red-700 font-medium mt-2">
                  Current DSR: {result.dsr.toFixed(1)}% (Recommended: ≤35%)
                </p>
              </CardContent>
            </Card>
          )}

          <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
            <p className="font-medium mb-1">💡 Affordability Notes:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Based on 35% maximum DSR (Debt Service Ratio) as per Malaysian banking guidelines</li>
              <li>Assumes 90% LTV (Loan-to-Value) ratio for property valuation</li>
              <li>Actual approval depends on credit score, employment history, and bank policies</li>
              <li>Consider additional costs: down payment (10%), stamp duty, legal fees</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};