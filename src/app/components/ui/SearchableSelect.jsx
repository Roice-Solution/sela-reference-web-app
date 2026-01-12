import { useEffect, useMemo, useRef, useState } from "react";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "cmdk";

export function SearchableSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  emptyText,
  disabled,
}) {
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-slate-100"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? "text-slate-900" : "text-slate-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="ml-2 text-xs text-slate-500" aria-hidden="true">
          v
        </span>
      </button>

      {open ? (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
          <Command>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder={placeholder}
              className="w-full border-b border-slate-200 px-3 py-2 text-sm outline-none"
            />
            <CommandList className="max-h-60 overflow-auto p-1">
              <CommandEmpty className="px-3 py-2 text-sm text-slate-500">
                {emptyText}
              </CommandEmpty>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.searchValue ?? option.label}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm text-slate-800 aria-selected:bg-slate-100"
                >
                  <span>{option.label}</span>
                  {option.subLabel ? (
                    <span className="text-xs text-slate-400">{option.subLabel}</span>
                  ) : null}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </div>
      ) : null}
    </div>
  );
}
