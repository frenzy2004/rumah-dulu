import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Shield, Search, Calculator } from "lucide-react";

interface CostBreakdownProps {
  stampDuty: number;
  legalFees: number;
  valuationFees: number;
  mrtaInsurance: number;
  totalUpfront: number;
}

export const CostBreakdown = ({
  stampDuty,
  legalFees,
  valuationFees,
  mrtaInsurance,
  totalUpfront
}: CostBreakdownProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const costs = [
    {
      name: "Stamp Duty",
      amount: stampDuty,
      icon: FileText,
      description: "Government tax on property transfer (progressive rates)",
      color: "text-red-600"
    },
    {
      name: "Legal Fees",
      amount: legalFees,
      icon: Calculator,
      description: "Lawyer fees for property transfer documentation",
      color: "text-blue-600"
    },
    {
      name: "Valuation Fees",
      amount: valuationFees,
      icon: Search,
      description: "Bank's property assessment fees",
      color: "text-green-600"
    },
    {
      name: "MRTA Insurance",
      amount: mrtaInsurance,
      icon: Shield,
      description: "Mortgage Reducing Term Assurance (recommended)",
      color: "text-purple-600"
    }
  ];

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Malaysia-Specific Costs</span>
          <Badge className="bg-gradient-accent text-accent-foreground">
            Total: {formatCurrency(totalUpfront)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {costs.map((cost) => (
            <div key={cost.name} className="flex items-start gap-3 p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className={`p-2 rounded-full bg-muted ${cost.color}`}>
                <cost.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-medium text-sm">{cost.name}</h4>
                  <span className="font-bold text-sm">{formatCurrency(cost.amount)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {cost.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-4">
          <div className="bg-gradient-background p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground">Total Upfront Costs</h4>
                <p className="text-sm text-muted-foreground">Amount needed on top of down payment</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(totalUpfront)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
          <p className="font-medium mb-1">💡 Calculation Notes:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Stamp duty uses Malaysia's progressive rates (1%-4%)</li>
            <li>Legal fees follow Malaysian Bar Council scale</li>
            <li>Valuation fees are typically 0.25% of property value (capped at RM2,500)</li>
            <li>MRTA premium is approximately 0.6% of loan amount</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};