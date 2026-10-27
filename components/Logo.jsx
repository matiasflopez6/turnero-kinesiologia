// Logo de MFL Systems en su versión para el tema activo.
export default function Logo({ variant = 'sin-tagline', className = '' }) {
  return (
    <>
      <img className={`logo-dia ${className}`} src={`/marca/mfl-${variant === 'monograma' ? 'monograma-claro' : 'logo-sin-tagline-claro'}.svg`} alt="MFL Systems" />
      <img className={`logo-noche ${className}`} src={`/marca/mfl-${variant === 'monograma' ? 'monograma' : 'logo-sin-tagline'}.svg`} alt="MFL Systems" />
    </>
  );
}
