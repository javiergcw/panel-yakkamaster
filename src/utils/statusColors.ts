/**
 * Colores estándar para estados de verificación y status.
 * Amarillo = pending, Rojo = denegado, Verde = aprobado.
 */
export const STATUS_COLORS = {
  /** Pendiente */
  pending: {
    bg: '#f9a825',
    color: '#1d1d1f',
  },
  /** Denegado / No verificado */
  denied: {
    bg: '#d32f2f',
    color: '#ffffff',
  },
  /** Aprobado / Verificado */
  approved: {
    bg: '#66bb6a',
    color: '#ffffff',
  },
  /** Neutral / inactivo */
  neutral: {
    bg: '#f5f5f7',
    color: '#1d1d1f',
  },
} as const;

/**
 * Devuelve bg y color para verification_status.
 * pending -> amarillo, not_verified -> rojo, verified -> verde.
 */
export function getVerificationStatusColors(
  verificationStatus: string | null | undefined
): { bg: string; color: string } {
  if (!verificationStatus) return STATUS_COLORS.neutral;
  switch (verificationStatus) {
    case 'verified':
      return STATUS_COLORS.approved;
    case 'not_verified':
      return STATUS_COLORS.denied;
    case 'pending':
    default:
      return STATUS_COLORS.pending;
  }
}

/**
 * Para status genérico: active -> verde, inactive -> rojo, resto neutral.
 */
export function getStatusColors(status: string | null | undefined): { bg: string; color: string } {
  if (!status) return STATUS_COLORS.neutral;
  switch (status.toLowerCase()) {
    case 'active':
      return STATUS_COLORS.approved;
    case 'inactive':
      return STATUS_COLORS.denied;
    default:
      return STATUS_COLORS.neutral;
  }
}
