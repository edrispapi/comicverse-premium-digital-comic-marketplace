import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
export type MultiSelectOption = {
  value: string
  label: string
}
interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};
const itemVariants = {
  hidden: { y: -10, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};
export function MultiSelectField({
  options,
  selected,
  onChange,
  placeholder = "Select...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value]
    onChange(newSelected)
  }
  const handleRemove = (value: string) => {
    onChange(selected.filter((item) => item !== value))
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-auto min-h-10", className)}
        >
          <div className="flex gap-1 flex-wrap items-center">
            {selected.length > 0 ? (
              options
                .filter((option) => selected.includes(option.value))
                .map((option) => (
                  <Badge
                    variant="secondary"
                    key={option.value}
                    className="mr-1 bg-red-500/20 text-red-400 border-red-500/30 transition-all duration-200 hover:scale-105 hover:shadow-red-glow"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(option.value)
                    }}
                  >
                    {option.label}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))
            ) : (
              <span>{placeholder}</span>
            )}
            {selected.length > 0 && (
              <Badge variant="outline" className="font-mono">{selected.length}</Badge>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 glass-dark backdrop-blur-lg shadow-red-glow border-white/10">
        <Command>
          <CommandInput 
            placeholder="Search..." 
            className="focus:ring-2 focus:ring-red-500/50 focus:shadow-lg focus:shadow-red-500/20"
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <AnimatePresence>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <CommandGroup>
                  {options.map((option) => (
                    <motion.div key={option.value} variants={itemVariants}>
                      <CommandItem
                        onSelect={() => handleSelect(option.value)}
                        className="cursor-pointer hover:!bg-red-500/10 hover:!text-red-400 transition-transform duration-200 hover:scale-[1.02]"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selected.includes(option.value)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    </motion.div>
                  ))}
                </CommandGroup>
              </motion.div>
            </AnimatePresence>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}