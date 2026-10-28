"use client";

import React, { useState, useEffect } from "react";
import { formatWithCommas, parsePrice } from "~/lib/price";

export { formatWithCommas, parsePrice };

export interface FormattedPriceInputProps {
  name?: string;
  defaultValue?: number;
  value?: number;
  onChange?: (val: number) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  unit?: string;
}

export function FormattedPriceInput({
  name,
  defaultValue,
  value: controlledValue,
  onChange,
  placeholder = "0",
  required = false,
  className = "",
  unit = "VNĐ",
}: FormattedPriceInputProps) {
  const [displayValue, setDisplayValue] = useState<string>(() => {
    const init = controlledValue !== undefined ? controlledValue : defaultValue;
    return formatWithCommas(init);
  });

  useEffect(() => {
    if (controlledValue !== undefined) {
      setDisplayValue(formatWithCommas(controlledValue));
    }
  }, [controlledValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, "");
    if (!rawDigits) {
      setDisplayValue("");
      onChange?.(0);
      return;
    }

    const num = Number(rawDigits);
    const formatted = num.toLocaleString("en-US");
    setDisplayValue(formatted);
    onChange?.(num);
  };

  return (
    <div className="relative flex items-center">
      <input
        type="text"
        inputMode="numeric"
        name={name}
        required={required}
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`${className} ${unit ? "pr-12" : ""}`}
      />
      {unit && (
        <span className="absolute right-3 text-xs text-[#888888] font-medium pointer-events-none select-none">
          {unit}
        </span>
      )}
    </div>
  );
}
