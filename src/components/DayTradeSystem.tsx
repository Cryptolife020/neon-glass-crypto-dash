
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  RefreshCw, 
  Calculator,
  Calendar,
  DollarSign,
  BarChart3,
  Trophy,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { DayTradeRecord, CompoundInterestGoal, DayOperation, CycleData } from '@/types/dayTrade';

const DayTradeSystem = () => {
  // Estados principais
  const [marketMode, setMarketMode] = useState<'spot' | 'futures'>('spot');
  const [box1Value, setBox1Value] = useState<string>('');
  const [box2Value, setBox2Value] = useState<string>('');
  const [records, setRecords] = useState<DayTradeRecord[]>([]);
  const [goals, setGoals] = useState<CompoundInterestGoal[]>([]);
  const [cycleData, setCycleData] = useState<CycleData>({
    currentCycle: 1,
    completedDays: 0,
    operations: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, status: 'pending' })),
    box1Balance: 0,
    box2Balance: 0,
    totalInvested: 0,
    netProfit: 0
  });
  
  // Estados para metas de juros compostos
  const [goalInvestment, setGoalInvestment] = useState<string>('');
  const [goalPercentage, setGoalPercentage] = useState<string>('');

  // Registrar valores nos caixas
  const handleRegisterValues = () => {
    if (!box1Value || !box2Value) {
      toast({
        title: "Erro",
        description: "Preencha ambos os caixas",
        variant: "destructive"
      });
      return;
    }

    const newRecord: DayTradeRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      box1: parseFloat(box1Value),
      box2: parseFloat(box2Value),
      marketMode,
      observation: `Registro ${marketMode.toUpperCase()}`
    };

    setRecords(prev => [...prev, newRecord]);
    
    setCycleData(prev => ({
      ...prev,
      box1Balance: prev.box1Balance + parseFloat(box1Value),
      box2Balance: prev.box2Balance + parseFloat(box2Value),
      totalInvested: prev.totalInvested + parseFloat(box1Value) + parseFloat(box2Value)
    }));

    setBox1Value('');
    setBox2Value('');

    toast({
      title: "Sucesso!",
      description: "Valores registrados com sucesso",
    });
  };

  // Reiniciar operacional
  const handleResetOperational = () => {
    setRecords([]);
    setCycleData({
      currentCycle: 1,
      completedDays: 0,
      operations: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, status: 'pending' })),
      box1Balance: 0,
      box2Balance: 0,
      totalInvested: 0,
      netProfit: 0
    });
    setGoals([]);
    
    toast({
      title: "Reset Completo",
      description: "Sistema reiniciado com sucesso",
    });
  };

  // Calcular metas com juros compostos
  const calculateCompoundGoals = () => {
    if (!goalInvestment || !goalPercentage) {
      toast({
        title: "Erro",
        description: "Preencha o investimento e a porcentagem",
        variant: "destructive"
      });
      return;
    }

    const investment = parseFloat(goalInvestment);
    const percentage = parseFloat(goalPercentage) / 100;
    const newGoals: CompoundInterestGoal[] = [];

    let accumulated = investment;
    
    for (let day = 1; day <= 30; day++) {
      const goal = accumulated * percentage;
      accumulated += goal;
      
      newGoals.push({
        day,
        investment: day === 1 ? investment : newGoals[day - 2].accumulated,
        returnPercentage: parseFloat(goalPercentage),
        goal,
        accumulated
      });
    }

    setGoals(newGoals);
    
    toast({
      title: "Metas Calculadas!",
      description: "Tabela de juros compostos gerada",
    });
  };

  // Lidar com operação do dia
  const handleDayOperation = (dayNumber: number, operationType: 'profit' | 'loss', value: number) => {
    const dayGoal = goals.find(g => g.day === dayNumber);
    
    setCycleData(prev => {
      const newOperations = [...prev.operations];
      const operationIndex = newOperations.findIndex(op => op.day === dayNumber);
      
      if (operationType === 'profit') {
        if (dayGoal) {
          if (value === dayGoal.goal) {
            // Bateu a meta exata
            newOperations[operationIndex] = { day: dayNumber, status: 'goal', value, isGoalMet: true };
            toast({
              title: "🎉 Parabéns!",
              description: "Você bateu a meta do dia!",
            });
          } else if (value > dayGoal.goal) {
            // Lucro maior que a meta
            newOperations[operationIndex] = { day: dayNumber, status: 'profit', value, isGoalMet: true };
          } else {
            // Lucro menor que a meta
            newOperations[operationIndex] = { day: dayNumber, status: 'profit', value, isGoalMet: false };
            toast({
              title: "Continue Firme!",
              description: "Você não bateu a meta, mas continue tentando!",
            });
          }
        }
        
        return {
          ...prev,
          operations: newOperations,
          box1Balance: prev.box1Balance + value,
          completedDays: prev.completedDays + 1,
          netProfit: prev.netProfit + value
        };
      } else {
        // Prejuízo
        newOperations[operationIndex] = { day: dayNumber, status: 'loss', value };
        
        return {
          ...prev,
          operations: newOperations,
          box1Balance: Math.max(0, prev.box1Balance - value),
          completedDays: prev.completedDays + 1,
          netProfit: prev.netProfit - value
        };
      }
    });
  };

  // Calcular estatísticas
  const totalBalance = cycleData.box1Balance + cycleData.box2Balance;
  const profitPercentage = cycleData.totalInvested > 0 
    ? ((cycleData.netProfit / cycleData.totalInvested) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="min-h-screen p-4 space-y-6 glass-background">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Sistema Day Trade
        </h1>
        <p className="text-muted-foreground">Controle profissional de operações financeiras</p>
      </div>

      {/* Fluxograma */}
      <Card className="glass-card border-neon-blue-400/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-neon-blue-400">
            <BarChart3 className="w-5 h-5" />
            Fluxograma Operacional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-64 glass rounded-lg flex items-center justify-center border border-neon-blue-400/30">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-neon-blue-400 mx-auto mb-4" />
              <p className="text-foreground">Fluxograma do Sistema</p>
              <p className="text-sm text-muted-foreground">Ilustração do processo operacional</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registro de Valores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-purple-400/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <DollarSign className="w-5 h-5" />
              Registro de Valores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-foreground">Modo de Mercado</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={marketMode === 'spot' ? 'default' : 'outline'}
                  onClick={() => setMarketMode('spot')}
                  className="flex-1 glass hover:bg-white/20 transition-all"
                >
                  Spot
                </Button>
                <Button
                  variant={marketMode === 'futures' ? 'default' : 'outline'}
                  onClick={() => setMarketMode('futures')}
                  className="flex-1 glass hover:bg-white/20 transition-all"
                >
                  Futuros
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="box1" className="text-foreground">Caixa 1 - Operação</Label>
              <Input
                id="box1"
                type="number"
                value={box1Value}
                onChange={(e) => setBox1Value(e.target.value)}
                placeholder="Valor para operação"
                className="glass border-green-400/30 focus:border-green-400 transition-colors"
              />
            </div>
            
            <div>
              <Label htmlFor="box2" className="text-foreground">Caixa 2 - Stop Loss</Label>
              <Input
                id="box2"
                type="number"
                value={box2Value}
                onChange={(e) => setBox2Value(e.target.value)}
                placeholder="Valor para cobrir perdas"
                className="glass border-orange-400/30 focus:border-orange-400 transition-colors"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleRegisterValues} 
                className="flex-1 bg-gradient-to-r from-neon-blue-400 to-purple-500 hover:from-neon-blue-500 hover:to-purple-600 text-white shadow-lg"
              >
                Registrar Valores
              </Button>
              <Button 
                onClick={handleResetOperational} 
                variant="outline" 
                className="flex-1 glass border-red-400/30 hover:bg-red-400/10 hover:border-red-400"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reiniciar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Display dos Caixas */}
        <Card className="glass-card border-green-400/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <Target className="w-5 h-5" />
              Saldo dos Caixas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-4 rounded-lg border border-green-400/30 backdrop-blur-xl">
                <p className="text-sm text-green-300">Caixa 1</p>
                <p className="text-2xl font-bold text-green-400">
                  ${cycleData.box1Balance.toFixed(2)}
                </p>
              </div>
              <div className="glass p-4 rounded-lg border border-orange-400/30 backdrop-blur-xl">
                <p className="text-sm text-orange-300">Caixa 2</p>
                <p className="text-2xl font-bold text-orange-400">
                  ${cycleData.box2Balance.toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="glass p-4 rounded-lg border border-neon-blue-400/30 backdrop-blur-xl">
              <p className="text-sm text-neon-blue-300">Saldo Total</p>
              <p className="text-3xl font-bold text-neon-blue-400">
                ${totalBalance.toFixed(2)}
              </p>
              <p className={`text-sm ${parseFloat(profitPercentage) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {parseFloat(profitPercentage) >= 0 ? '+' : ''}{profitPercentage}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Registros */}
      <Card className="glass-card border-neon-blue-400/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-neon-blue-400">
            <Calendar className="w-5 h-5" />
            Histórico de Registros
          </CardTitle>
        </CardHeader>
        <CardContent>
          {records.length > 0 ? (
            <div className="glass rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-foreground">Data</TableHead>
                    <TableHead className="text-foreground">Modo</TableHead>
                    <TableHead className="text-foreground">Caixa 1</TableHead>
                    <TableHead className="text-foreground">Caixa 2</TableHead>
                    <TableHead className="text-foreground">Observação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-muted-foreground">{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={record.marketMode === 'spot' ? 'default' : 'secondary'} className="glass">
                          {record.marketMode.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-green-400">${record.box1.toFixed(2)}</TableCell>
                      <TableCell className="text-orange-400">${record.box2.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground">{record.observation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="glass rounded-lg p-8">
              <p className="text-center text-muted-foreground">Nenhum registro encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Metas com Juros Compostos */}
      <Card className="glass-card border-purple-400/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <Calculator className="w-5 h-5" />
            Metas com Juros Compostos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="goalInvestment" className="text-foreground">Valor Investido</Label>
              <Input
                id="goalInvestment"
                type="number"
                value={goalInvestment}
                onChange={(e) => setGoalInvestment(e.target.value)}
                placeholder="Ex: 1000"
                className="glass border-purple-400/30 focus:border-purple-400"
              />
            </div>
            <div>
              <Label htmlFor="goalPercentage" className="text-foreground">Retorno Desejado (%)</Label>
              <Input
                id="goalPercentage"
                type="number"
                value={goalPercentage}
                onChange={(e) => setGoalPercentage(e.target.value)}
                placeholder="Ex: 2.5"
                className="glass border-purple-400/30 focus:border-purple-400"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={calculateCompoundGoals} 
                className="w-full bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white shadow-lg"
              >
                Calcular Metas
              </Button>
            </div>
          </div>

          {goals.length > 0 && (
            <div className="glass rounded-lg overflow-hidden max-h-64 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-foreground">Dia</TableHead>
                    <TableHead className="text-foreground">Investimento</TableHead>
                    <TableHead className="text-foreground">Retorno %</TableHead>
                    <TableHead className="text-foreground">Meta</TableHead>
                    <TableHead className="text-foreground">Acumulado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {goals.map((goal) => (
                    <TableRow key={goal.day} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-muted-foreground">{goal.day}</TableCell>
                      <TableCell className="text-muted-foreground">${goal.investment.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground">{goal.returnPercentage}%</TableCell>
                      <TableCell className="text-neon-blue-400">${goal.goal.toFixed(2)}</TableCell>
                      <TableCell className="text-green-400">${goal.accumulated.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Controle de Ciclos e Operações Diárias */}
      <Card className="glass-card border-yellow-400/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-400">
            <Trophy className="w-5 h-5" />
            Ciclo {cycleData.currentCycle} - Operações Diárias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-foreground">
              Dias Completados: {cycleData.completedDays}/30
            </p>
            <div className="w-full glass rounded-full h-3 mt-2 border border-white/20">
              <div 
                className="bg-gradient-to-r from-neon-blue-400 to-purple-500 h-full rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${(cycleData.completedDays / 30) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {cycleData.operations.map((operation) => (
              <DayOperationButton
                key={operation.day}
                operation={operation}
                dayGoal={goals.find(g => g.day === operation.day)}
                onOperation={handleDayOperation}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Componente para botão de operação do dia
const DayOperationButton: React.FC<{
  operation: DayOperation;
  dayGoal?: CompoundInterestGoal;
  onOperation: (day: number, type: 'profit' | 'loss', value: number) => void;
}> = ({ operation, dayGoal, onOperation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [operationType, setOperationType] = useState<'profit' | 'loss'>('profit');
  const [value, setValue] = useState('');

  const handleConfirm = () => {
    if (!value) return;
    
    onOperation(operation.day, operationType, parseFloat(value));
    setIsOpen(false);
    setValue('');
  };

  const getButtonColor = () => {
    switch (operation.status) {
      case 'goal':
        return 'glass border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10';
      case 'profit':
        return 'glass border-green-400/50 text-green-400 hover:bg-green-400/10';
      case 'loss':
        return 'glass border-red-400/50 text-red-400 hover:bg-red-400/10';
      default:
        return 'glass border-white/30 text-foreground hover:bg-neon-blue-400/20 hover:border-neon-blue-400/50 hover:text-neon-blue-400';
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className={`h-12 w-full ${getButtonColor()} backdrop-blur-xl transition-all duration-300`}
          disabled={operation.status !== 'pending'}
        >
          <div className="text-center">
            <div className="text-xs">Dia</div>
            <div className="font-bold">{operation.day}</div>
            {operation.status === 'goal' && <CheckCircle className="w-3 h-3 mx-auto" />}
            {operation.status === 'profit' && <TrendingUp className="w-3 h-3 mx-auto" />}
            {operation.status === 'loss' && <TrendingDown className="w-3 h-3 mx-auto" />}
          </div>
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="glass-card border-neon-blue-400/30 shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-neon-blue-400">
            Operação do Dia {operation.day}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {dayGoal && (
              <p className="text-yellow-400 mb-2 font-semibold">
                Meta do dia: ${dayGoal.goal.toFixed(2)}
              </p>
            )}
            Registre o resultado da sua operação:
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={operationType === 'profit' ? 'default' : 'outline'}
              onClick={() => setOperationType('profit')}
              className="flex-1 glass hover:bg-green-400/20 hover:border-green-400 transition-all"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Lucro
            </Button>
            <Button
              variant={operationType === 'loss' ? 'default' : 'outline'}
              onClick={() => setOperationType('loss')}
              className="flex-1 glass hover:bg-red-400/20 hover:border-red-400 transition-all"
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              Prejuízo
            </Button>
          </div>
          
          <div>
            <Label htmlFor="operationValue" className="text-foreground">Valor</Label>
            <Input
              id="operationValue"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Digite o valor"
              className="glass border-white/30 focus:border-neon-blue-400 transition-colors"
            />
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel className="glass hover:bg-white/10 border-white/30">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            disabled={!value}
            className="bg-gradient-to-r from-neon-blue-400 to-purple-500 hover:from-neon-blue-500 hover:to-purple-600 text-white shadow-lg"
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DayTradeSystem;
