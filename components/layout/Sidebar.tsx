interface SidebarProps {
  children: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="space-y-8">
      {children}
    </aside>
  )
}
