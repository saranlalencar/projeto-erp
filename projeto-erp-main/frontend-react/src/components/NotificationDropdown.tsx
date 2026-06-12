import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Icon } from '../design-system/components';

interface Notificacao {
  id: string;
  tipo: 'danger' | 'warning' | 'info';
  titulo: string;
  descricao: string;
  rota: string;
  icone: string;
}

const TIPO_COLOR: Record<Notificacao['tipo'], string> = {
  danger:  'var(--danger-text)',
  warning: 'var(--warning-text)',
  info:    'var(--info-text)',
};

const TIPO_BG: Record<Notificacao['tipo'], string> = {
  danger:  'var(--danger-bg)',
  warning: 'var(--warning-bg)',
  info:    'var(--info-bg)',
};

const TIPO_DOT: Record<Notificacao['tipo'], string> = {
  danger:  '#ef4444',
  warning: '#f59e0b',
  info:    '#3b82f6',
};

export function NotificationDropdown() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notificacao[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const carregar = useCallback(() => {
    api.get<Notificacao[]>('/api/notificacoes').then(setNotifs).catch(() => {});
  }, []);

  // Busca ao montar e a cada 60 segundos
  useEffect(() => {
    carregar();
    const id = setInterval(carregar, 60_000);
    return () => clearInterval(id);
  }, [carregar]);

  // Fecha ao clicar fora
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const total = notifs.length;
  const temPerigo = notifs.some((n) => n.tipo === 'danger');

  function ir(rota: string, id: string) {
    setOpen(false);
    navigate(`${rota}?hl=${id}`);
  }

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      {/* Botão sino com badge */}
      <button
        type="button"
        aria-label="Notificações"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          background: open ? 'var(--slate-100)' : 'transparent',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          transition: 'background var(--duration-fast)',
        }}
        onMouseEnter={(e) => { if (!open) e.currentTarget.style.background = 'var(--slate-100)'; }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.background = 'transparent'; }}
      >
        <Icon name="bell" size={18} />
        {total > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              minWidth: 16,
              height: 16,
              padding: '0 4px',
              background: temPerigo ? '#ef4444' : '#f59e0b',
              color: '#fff',
              borderRadius: 'var(--radius-full, 9999px)',
              fontSize: 10,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
              pointerEvents: 'none',
              boxShadow: '0 0 0 2px var(--surface-card)',
            }}
          >
            {total > 9 ? '9+' : total}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 340,
            background: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
            zIndex: 200,
            overflow: 'hidden',
          }}
        >
          {/* Cabeçalho */}
          <div
            style={{
              padding: '13px 16px',
              borderBottom: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--surface-sunken)',
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }}>
              Notificações
            </span>
            {total > 0 && (
              <span
                style={{
                  background: temPerigo ? 'var(--danger-bg)' : 'var(--warning-bg)',
                  color: temPerigo ? 'var(--danger-text)' : 'var(--warning-text)',
                  borderRadius: 'var(--radius-full, 9999px)',
                  padding: '2px 9px',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                }}
              >
                {total} pendente{total > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Lista */}
          {total === 0 ? (
            <div
              style={{
                padding: '32px 16px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: 'var(--text-sm)',
              }}
            >
              <div style={{ color: 'var(--success-text)', display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                <Icon name="circleCheck" size={32} />
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text-body)', marginBottom: 4 }}>Tudo em dia!</div>
              <div>Nenhuma notificação pendente.</div>
            </div>
          ) : (
            <div style={{ maxHeight: 380, overflowY: 'auto' }}>
              {notifs.map((n, i) => (
                <button
                  type="button"
                  key={n.id}
                  role="menuitem"
                  onClick={() => ir(n.rota, n.id)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    background: 'none',
                    border: 'none',
                    borderBottom: i < notifs.length - 1 ? '1px solid var(--border-default)' : 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background var(--duration-fast)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-sunken)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                >
                  {/* Ícone com cor do tipo */}
                  <span
                    style={{
                      flexShrink: 0,
                      width: 34,
                      height: 34,
                      borderRadius: 'var(--radius-md)',
                      background: TIPO_BG[n.tipo],
                      color: TIPO_COLOR[n.tipo],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name={n.icone} size={16} />
                  </span>

                  {/* Texto */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span
                        style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 600,
                          color: 'var(--text-strong)',
                          lineHeight: 1.4,
                        }}
                      >
                        {n.titulo}
                      </span>
                      {/* Dot indicador */}
                      <span
                        style={{
                          flexShrink: 0,
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: TIPO_DOT[n.tipo],
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {n.descricao}
                    </div>
                  </div>

                  {/* Seta */}
                  <span style={{ flexShrink: 0, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', marginTop: 8 }}>
                    <Icon name="chevronRight" size={14} />
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Rodapé */}
          {total > 0 && (
            <div
              style={{
                padding: '10px 16px',
                borderTop: '1px solid var(--border-default)',
                background: 'var(--surface-sunken)',
                textAlign: 'center',
              }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
