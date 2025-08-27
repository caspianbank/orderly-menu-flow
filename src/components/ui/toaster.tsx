import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider duration={3000}>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}

      {/* Responsive positioning */}
      <ToastViewport
        className="
          fixed z-50 flex flex-col gap-2 p-4
          top-2 left-1/2 -translate-x-1/2   /* mobile: top center */
          sm:top-auto sm:bottom-2 sm:left-2 sm:translate-x-0 /* desktop: bottom-left */
        "
      />
    </ToastProvider>
  )
}
