"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { X, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createPortal } from "react-dom";

interface CalculatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface HistoryItem {
  expression: string;
  result: string;
  timestamp: number;
}

interface Position {
  x: number;
  y: number;
}

export function Calculator({ open, onOpenChange }: CalculatorProps) {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const addToHistory = (expression: string, result: string) => {
    const newItem: HistoryItem = {
      expression,
      result,
      timestamp: Date.now(),
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 9)]); // Keep only last 10 items
  };

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
      // Update expression to show current operation being built
      if (operation && previousValue) {
        setExpression(`${previousValue} ${operation} ${num}`);
      }
    } else {
      const newDisplay = display === "0" ? num : display + num;
      setDisplay(newDisplay);
      // Update expression if we're building an operation
      if (operation && previousValue) {
        setExpression(`${previousValue} ${operation} ${newDisplay}`);
      }
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      if (operation && previousValue) {
        setExpression(`${previousValue} ${operation} 0.`);
      }
    } else if (display.indexOf(".") === -1) {
      const newDisplay = display + ".";
      setDisplay(newDisplay);
      if (operation && previousValue) {
        setExpression(`${previousValue} ${operation} ${newDisplay}`);
      }
    }
  };

  const clear = () => {
    setDisplay("0");
    setExpression("");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(display);
      setExpression(`${display} ${nextOperation}`);
    } else if (operation) {
      const currentValue = previousValue || "0";
      const result = calculate(parseFloat(currentValue), inputValue, operation);

      if (result !== null) {
        const fullExpression = `${currentValue} ${operation} ${inputValue}`;
        addToHistory(fullExpression, result.toString());

        setDisplay(result.toString());
        setPreviousValue(result.toString());
        setExpression(`${result} ${nextOperation}`);
      }
    } else {
      // Update expression when continuing from a previous result
      setExpression(`${display} ${nextOperation}`);
      setPreviousValue(display);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (
    firstValue: number,
    secondValue: number,
    operation: string,
  ): number | null => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return secondValue !== 0 ? firstValue / secondValue : null;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const inputValue = parseFloat(display);
      const result = calculate(
        parseFloat(previousValue),
        inputValue,
        operation,
      );

      if (result !== null) {
        const fullExpression = `${previousValue} ${operation} ${inputValue}`;
        addToHistory(fullExpression, result.toString());
        setDisplay(result.toString());
        setExpression(fullExpression);
      }

      setOperation(null);
      setPreviousValue(null);
      setWaitingForOperand(true);
    }
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (modalRef.current) {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        });
      }
    },
    [position],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && modalRef.current) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // Keep within viewport bounds with padding
        const padding = 20;
        const modalWidth = modalRef.current.offsetWidth;
        const modalHeight = modalRef.current.offsetHeight;
        const maxX = window.innerWidth - modalWidth - padding;
        const maxY = window.innerHeight - modalHeight - padding;

        setPosition({
          x: Math.max(padding, Math.min(newX, maxX)),
          y: Math.max(padding, Math.min(newY, maxY)),
        });
      }
    },
    [isDragging, dragStart],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Initialize position when calculator opens
  useEffect(() => {
    if (open && !isInitialized) {
      const centerX = (window.innerWidth - 500) / 2; // 500px is max-w-lg
      const centerY = (window.innerHeight - 600) / 2; // estimated height

      setPosition({
        x: Math.max(20, centerX),
        y: Math.max(20, centerY),
      });
      setIsInitialized(true);
    } else if (!open) {
      setIsInitialized(false);
    }
  }, [open, isInitialized]);

  const buttonClass = "h-12 text-lg font-semibold rounded-lg transition-colors";
  const numberButtonClass = `${buttonClass} bg-muted hover:bg-muted/80`;
  const operatorButtonClass = `${buttonClass} bg-primary text-primary-foreground hover:bg-primary/90`;
  const equalsButtonClass = `${buttonClass} bg-green-600 text-white hover:bg-green-700`;

  if (!open) return null;

  const calculatorContent = (
    <div
      ref={modalRef}
      className="bg-background fixed z-[9999] max-w-lg rounded-lg border-2 shadow-2xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "auto",
      }}
    >
      <Card className="w-full border-0 shadow-none">
        <CardHeader
          className="bg-muted/30 flex cursor-grab flex-row items-center justify-between rounded-t-lg pb-3 select-none"
          onMouseDown={handleMouseDown}
        >
          <CardTitle className="text-lg">Calculator</CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="h-8 w-8 p-0"
            >
              <History className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="w-full p-4">
          {/* Display */}
          <div className="bg-muted mb-4 rounded-lg p-4">
            {/* Expression display */}
            {expression && (
              <div className="text-muted-foreground min-h-[1rem] text-right font-mono text-sm">
                {expression}
              </div>
            )}
            {/* Main display */}
            <div className="text-foreground min-h-[2rem] overflow-hidden text-right font-mono text-2xl font-bold">
              {display}
            </div>
          </div>

          {/* History Panel */}
          {showHistory && (
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">History</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setHistory([])}
                  className="h-6 text-xs"
                >
                  Clear
                </Button>
              </div>
              <div className="bg-muted/50 max-h-32 overflow-y-auto rounded-lg p-2">
                {history.length === 0 ? (
                  <p className="text-muted-foreground py-2 text-center text-xs">
                    No calculations yet
                  </p>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.timestamp}
                      className="hover:bg-muted cursor-pointer rounded px-2 py-1 font-mono text-xs"
                      onClick={() => setDisplay(item.result)}
                    >
                      <div className="text-muted-foreground">
                        {item.expression}
                      </div>
                      <div className="font-semibold">= {item.result}</div>
                    </div>
                  ))
                )}
              </div>
              <Separator className="my-3" />
            </div>
          )}

          {/* Calculator Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {/* Row 1 */}
            <Button variant="outline" className={buttonClass} onClick={clear}>
              C
            </Button>
            <Button
              variant="outline"
              className={buttonClass}
              onClick={() => setDisplay(display.slice(0, -1) || "0")}
            >
              ⌫
            </Button>
            <Button
              variant="outline"
              className={operatorButtonClass}
              onClick={() => performOperation("÷")}
            >
              ÷
            </Button>
            <Button
              variant="outline"
              className={operatorButtonClass}
              onClick={() => performOperation("×")}
            >
              ×
            </Button>

            {/* Row 2 */}
            <Button
              variant="outline"
              className={numberButtonClass}
              onClick={() => inputNumber("7")}
            >
              7
            </Button>
            <Button
              variant="outline"
              className={numberButtonClass}
              onClick={() => inputNumber("8")}
            >
              8
            </Button>
            <Button
              variant="outline"
              className={numberButtonClass}
              onClick={() => inputNumber("9")}
            >
              9
            </Button>
            <Button
              variant="outline"
              className={operatorButtonClass}
              onClick={() => performOperation("-")}
            >
              -
            </Button>

            {/* Row 3 */}
            <Button
              variant="outline"
              className={numberButtonClass}
              onClick={() => inputNumber("4")}
            >
              4
            </Button>
            <Button
              variant="outline"
              className={numberButtonClass}
              onClick={() => inputNumber("5")}
            >
              5
            </Button>
            <Button
              variant="outline"
              className={numberButtonClass}
              onClick={() => inputNumber("6")}
            >
              6
            </Button>
            <Button
              variant="outline"
              className={operatorButtonClass}
              onClick={() => performOperation("+")}
            >
              +
            </Button>

            {/* Row 4 */}
            <Button
              variant="outline"
              className={numberButtonClass}
              onClick={() => inputNumber("1")}
            >
              1
            </Button>
            <Button
              variant="outline"
              className={numberButtonClass}
              onClick={() => inputNumber("2")}
            >
              2
            </Button>
            <Button
              variant="outline"
              className={numberButtonClass}
              onClick={() => inputNumber("3")}
            >
              3
            </Button>
            <Button
              variant="outline"
              className={`${equalsButtonClass} row-span-2`}
              onClick={handleEquals}
            >
              =
            </Button>

            {/* Row 5 */}
            <Button
              variant="outline"
              className={`${numberButtonClass} col-span-2`}
              onClick={() => inputNumber("0")}
            >
              0
            </Button>
            <Button
              variant="outline"
              className={numberButtonClass}
              onClick={inputDecimal}
            >
              .
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Use portal to render outside of any container constraints
  return typeof window !== "undefined"
    ? createPortal(calculatorContent, document.body)
    : null;
}
