"use client"

// import { useTheme } from "next-themes"
import { useSelector } from "react-redux"
import { Toaster as Sonner, ToasterProps } from "sonner"
import type { RootState } from "@/store/store"

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = useSelector((state: RootState) => state.ui.theme)

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
