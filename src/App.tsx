/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { initHorrorEngine } from './game/horrorEngine.js';

export default function App() {
  useEffect(() => {
    initHorrorEngine();
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black select-none">
      <canvas id="c" />

      <div
        id="ingame_top_bar"
        style={{
          position: 'fixed',
          top: 'calc(8px + env(safe-area-inset-top, 0px))',
          right: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 5,
        }}
      >
        <button
          id="ingame_mode_btn"
          style={{
            display: 'none',
            margin: 0,
            padding: '6px 11px',
            fontSize: '12.5px',
            background: 'rgba(18, 6, 8, 0.88)',
            color: '#e7dec8',
            border: '1px solid #8b1e25',
            borderRadius: '3px',
            cursor: 'pointer',
            fontFamily: 'Georgia, serif',
            boxShadow: '0 2px 10px rgba(0,0,0,0.75)',
          }}
        >
          🤖 БОТ / ИГРОК [M]
        </button>
        <button
          id="lb"
          style={{
            display: 'none',
            margin: 0,
            padding: '6px 12px',
            fontSize: '13px',
            background: 'rgba(10, 4, 5, 0.84)',
            color: '#e7dec8',
            border: '1px solid #7f1d1d',
            borderRadius: '3px',
            cursor: 'pointer',
            fontFamily: 'Georgia, serif',
            boxShadow: '0 2px 10px rgba(0,0,0,0.75)',
          }}
        >
          В ЛОББИ [T]
        </button>
      </div>

      <div id="ov" className="ui-lobby-ov">
        <div id="lobby_snow_layer" aria-hidden="true" />
        <aside id="lobby_left_rail" aria-label="Панель эвента и меню">
          <button id="btn_event_rail" className="rail-btn" type="button">
            🎄 ЭВЕНТ
          </button>
          <button id="btn_updates_rail" className="rail-btn" type="button">
            📋 Список обновлений
          </button>
          <button id="btn_npc_quests_rail" className="rail-btn" type="button">
            🎅 Задания NPC
          </button>
          <button id="btn_friends_rail" className="rail-btn" type="button">
            👥 Друзья
          </button>
          <button id="btn_map_vote_rail" className="rail-btn" type="button">
            🗳 Карта
          </button>
          <button id="btn_export_html_rail" className="rail-btn" type="button">
            📦 Скачать игру (.html)
          </button>
        </aside>
        <h1>НЕ ОБОРАЧИВАЙСЯ</h1>
        <p>
          Найди 3 ключа в тёмном лабиринте и открой зелёную дверь выхода. Она ходит по
          коридорам. Она слышит. Она видит свет.
        </p>
        <p>
          <b>WASD</b> — идти · <b>мышь / ←→</b> — смотреть · <b>Shift</b> — бег (шумно!) ·{' '}
          <b>C</b> — красться (тихо) · <b>F</b> — телефон · <b>E</b> — действие / спрятаться в
          шкафу · <b>T</b> — выйти в лобби
        </p>
        <p>
          <b>Кооператив:</b> введи один и тот же код комнаты с друзьями — у вас общий
          лабиринт, общие ключи и один монстр на всех. <b>Ржавые ловушки</b> на полу гремят на
          весь лабиринт: обходи или обезвреживай, подходя на корточках (C).
        </p>
        <p>Играй в наушниках и в темноте. ПК или телефон.</p>
        <p style={{ color: '#b45349', fontSize: '13px' }}>
          ⚠ Резкие вспышки и громкие звуки (скримеры).
        </p>

        <div id="chapters_col" className="flex flex-col items-stretch gap-2 w-full max-w-[360px] mx-auto mt-3">
          <button id="cont" className="chapter-btn w-full" style={{ display: 'none' }}>
            ПРОДОЛЖИТЬ
          </button>
          <button
            id="lobby_mode_btn"
            className="chapter-btn w-full"
            style={{
              display: 'none',
              background: '#1e070a',
              borderColor: '#991b1b',
              color: '#e7dec8',
            }}
          >
            👹 БОТ ИЛИ ИГРОК
          </button>
          <button id="go" className="chapter-btn w-full">
            ГЛАВА 1 · ЛАБИРИНТ
          </button>
          <button id="g2" className="chapter-btn w-full">
            ГЛАВА 2 · ОСОБНЯК
          </button>
          <button id="g3" className="chapter-btn w-full" disabled style={{ opacity: 0.55 }}>
            ГЛАВА 3 · КЛАДБИЩЕ
          </button>
          <button id="g4" className="chapter-btn w-full" disabled style={{ opacity: 0.55 }}>
            ГЛАВА 4 · ГАРАЖИ
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
          <button
            id="ov_ach_btn"
            style={{
              background: '#1a1007',
              border: '1px solid #a16207',
              color: '#e7dec8',
            }}
          >
            🏆 ДОСТИЖЕНИЯ
          </button>
          <button
            id="ov_quest_btn"
            style={{
              background: '#1b0e06',
              border: '1px solid #b45309',
              color: '#e7dec8',
            }}
          >
            🎯 ЗАДАНИЯ
          </button>
          <button
            id="ov_streak_btn"
            style={{
              background: '#22070a',
              border: '1px solid #991b1b',
              color: '#f3d2cf',
            }}
          >
            🔥 СЕРИЯ
          </button>
          <button
            id="ov_avatar_btn"
            style={{
              background: '#16090b',
              border: '1px solid #8b1e25',
              color: '#e7dec8',
            }}
          >
            🎭 АВАТАР И РАМКА
          </button>
          <button
            id="ov_arts_btn"
            style={{
              background: '#170c08',
              border: '1px solid #92400e',
              color: '#e7dec8',
            }}
          >
            🎨 АРТЫ
          </button>
          <button
            id="ov_journal_btn"
            style={{
              background: '#1a1109',
              border: '1px solid #a16207',
              color: '#e7dec8',
            }}
          >
            📓 ЖУРНАЛ НАХОДОК
          </button>
          <button
            id="ov_shop_btn"
            style={{
              background: '#26090d',
              border: '1px solid #b91c1c',
              color: '#f7dfd9',
              fontWeight: 'bold',
            }}
          >
            🛒 МАГАЗИН
          </button>
          <button
            id="ov_settings_btn"
            style={{
              background: '#121011',
              border: '1px solid #524844',
              color: '#d6ccb8',
            }}
          >
            ⚙ НАСТРОЙКИ
          </button>
        </div>

        {/* In-Lobby XP Progression & Phone Customization */}
        <div
          id="lobby_xp_panel"
          style={{
            marginTop: '16px',
            width: '100%',
            maxWidth: '560px',
            background: 'rgba(13, 5, 7, 0.92)',
            border: '1px solid #5c191e',
            borderRadius: '4px',
            padding: '12px 14px',
            boxSizing: 'border-box',
            boxShadow: 'inset 0 0 24px rgba(0, 0, 0, 0.85), 0 0 20px rgba(120, 12, 18, 0.28)',
          }}
        />

        <div
          id="coop_section"
          style={{
            marginTop: '20px',
            width: '100%',
            maxWidth: '560px',
            background: 'rgba(13, 5, 7, 0.88)',
            border: '1px solid #5c191e',
            borderRadius: '4px',
            padding: '14px',
            boxSizing: 'border-box',
            boxShadow: 'inset 0 0 26px rgba(0, 0, 0, 0.85), 0 0 22px rgba(110, 10, 16, 0.25)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#e7dec8',
                fontWeight: 'bold',
                letterSpacing: '0.08em',
                fontSize: '14px',
              }}
            >
              <span>👥</span>
              <span>КООПЕРАТИВНЫЙ РЕЖИМ (СОВМЕСТНАЯ ИГРА)</span>
            </div>
            <span
              id="coop_status_indicator"
              style={{
                fontSize: '11.5px',
                color: '#84cc16',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#65a30d',
                  boxShadow: '0 0 6px #65a30d',
                }}
              />
              Сервер онлайн
            </span>
          </div>

          <p
            style={{
              fontSize: '12px',
              color: '#a89a88',
              margin: '0 0 12px',
              textAlign: 'left',
              lineHeight: 1.4,
            }}
          >
            Создай комнату и поделись кодом или подключись к друзьям. У вас общий лабиринт,
            синхронные ключи и один монстр на всех.
          </p>

          <div
            id="coop_my_style_bar"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(18, 7, 9, 0.85)',
              border: '1px solid #4c171d',
              borderRadius: '4px',
              padding: '8px 12px',
              marginBottom: '12px',
            }}
          >
            <div id="coop_avatar_preview" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: '#a89a88' }}>Твой стиль в коопе:</span>
            </div>
            <button
              id="btn_open_avatar_customizer"
              style={{
                margin: 0,
                padding: '5px 12px',
                fontSize: '12px',
                background: '#22090d',
                border: '1px solid #7f1d1d',
                color: '#e7dec8',
                borderRadius: '3px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              🎨 Сменить стиль
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <input
              id="nick"
              placeholder="Твоё имя"
              maxLength={10}
              style={{ flex: '1 1 120px' }}
            />
            <input
              id="code"
              placeholder="КОД КОМНАТЫ"
              maxLength={12}
              style={{
                flex: '1 1 130px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            />
            <select
              id="chs"
              style={{
                background: '#0b0506',
                color: '#e7dec8',
                border: '1px solid #5c191e',
                padding: '10px',
                font: '15px Georgia, serif',
                margin: '4px',
                borderRadius: '3px',
                flex: '1 1 110px',
                outline: 'none',
              }}
            >
              <option value="1">Глава 1</option>
              <option value="2">Глава 2</option>
              <option value="3">Глава 3</option>
              <option value="4">Глава 4</option>
              <option value="5">Глава 5 · Новогодняя</option>
            </select>
            <select
              id="coop_diff"
              style={{
                background: '#0b0506',
                color: '#e7dec8',
                border: '1px solid #5c191e',
                padding: '10px',
                font: '15px Georgia, serif',
                margin: '4px',
                borderRadius: '3px',
                flex: '1 1 115px',
                outline: 'none',
              }}
            >
              <option value="easy">Лёгкий</option>
              <option value="hard">Сложный</option>
              <option value="extreme">Экстрим</option>
            </select>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              justifyContent: 'center',
              marginTop: '10px',
            }}
          >
            <button
              id="btn_create_room"
              style={{
                margin: 0,
                padding: '8px 14px',
                fontSize: '13px',
                background: '#3d0c11',
                border: '1px solid #991b1b',
                color: '#e7dec8',
                flex: '1 1 140px',
              }}
            >
              + СОЗДАТЬ
            </button>
            <button
              id="btn_join_room"
              style={{
                margin: 0,
                padding: '8px 14px',
                fontSize: '13px',
                background: '#161112',
                border: '1px solid #5c4b47',
                color: '#e7dec8',
                flex: '1 1 140px',
              }}
            >
              ВОЙТИ ПО КОДУ
            </button>
            <button
              id="btn_quick_join"
              style={{
                margin: 0,
                padding: '8px 14px',
                fontSize: '13px',
                background: '#121518',
                border: '1px solid #475569',
                color: '#cbd5e1',
                flex: '1 1 140px',
              }}
            >
              🎲 БЫСТРЫЙ ПОИСК
            </button>
            {/* Legacy compatibility trigger */}
            <button id="mp" style={{ display: 'none' }}>
              КООПЕРАТИВ
            </button>
          </div>

          <p id="mpm" style={{ color: '#d97706', fontSize: '13px', margin: '8px 0 0' }}></p>
          <div id="coop_room_active" style={{ display: 'none' }}></div>
          <div
            id="ol"
            style={{ width: '100%', marginTop: '12px', textAlign: 'left' }}
          ></div>
        </div>
      </div>

      {/* Post-Death Screen Action Buttons */}
      <div
        id="dead_ui"
        className="ui-dead-panel"
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 'calc(32px + env(safe-area-inset-bottom, 0px))',
          left: '50%',
          zIndex: 80,
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '460px',
          padding: '0 16px',
          boxSizing: 'border-box',
          pointerEvents: 'auto',
        }}
      >
        <button
          id="dead_btn_retry"
          style={{
            flex: '1 1 180px',
            margin: 0,
            padding: '14px 22px',
            fontSize: '15px',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            background: 'linear-gradient(180deg, #520b12 0%, #240407 100%)',
            border: '2px solid #b91c1c',
            color: '#e7dec8',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: '0 0 28px rgba(185, 28, 28, 0.55), inset 0 0 12px rgba(0,0,0,0.7)',
            textShadow: '0 2px 4px #000',
            fontFamily: 'Georgia, serif',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
        >
          ПРОДОЛЖИТЬ
        </button>
        <button
          id="dead_btn_lobby"
          style={{
            flex: '1 1 180px',
            margin: 0,
            padding: '14px 22px',
            fontSize: '15px',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            background: 'linear-gradient(180deg, #171213 0%, #090607 100%)',
            border: '2px solid #574945',
            color: '#d6ccb8',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.85)',
            textShadow: '0 2px 4px #000',
            fontFamily: 'Georgia, serif',
            transition: 'transform 0.15s',
          }}
        >
          В ЛОББИ
        </button>
      </div>

      {/* Successful Escape Summary Overlay */}
      <div
        id="escape_ui"
        className="ui-modal-backdrop"
        style={{
          display: 'none',
          position: 'fixed',
          inset: 0,
          zIndex: 82,
          alignItems: 'flex-end',
          justifyContent: 'center',
          padding: '16px 16px calc(22px + env(safe-area-inset-bottom, 0px))',
          boxSizing: 'border-box',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            width: '100%',
            maxWidth: '520px',
            background: 'rgba(10, 6, 6, 0.94)',
            backdropFilter: 'blur(6px)',
            border: '2px solid #a16207',
            borderRadius: '6px',
            padding: '16px 18px',
            boxShadow: '0 0 36px rgba(161, 98, 7, 0.34), inset 0 0 28px rgba(0,0,0,0.85)',
            color: '#e7dec8',
            fontFamily: 'Georgia, serif',
            textAlign: 'center',
          }}
        >
          <div
            id="esc_title"
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#f59e0b',
              letterSpacing: '0.09em',
              marginBottom: '4px',
              textShadow: '0 2px 6px #000',
            }}
          >
            🚗 УСПЕШНЫЙ ПОБЕГ
          </div>
          <div
            id="esc_sub"
            style={{
              fontSize: '12.5px',
              color: '#b5a795',
              marginBottom: '12px',
            }}
          />
          <div
            id="esc_stats"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '8px',
              marginBottom: '14px',
              textAlign: 'left',
            }}
          />
          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <button
              id="esc_btn_next"
              style={{
                flex: '1 1 170px',
                margin: 0,
                padding: '11px 16px',
                fontSize: '14px',
                fontWeight: 'bold',
                letterSpacing: '0.08em',
                background: 'linear-gradient(180deg, #4b2b0a 0%, #241304 100%)',
                border: '2px solid #d97706',
                color: '#fef3c7',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'Georgia, serif',
              }}
            >
              ▶ ДАЛЕЕ
            </button>
            <button
              id="esc_btn_lobby"
              style={{
                flex: '1 1 150px',
                margin: 0,
                padding: '11px 16px',
                fontSize: '14px',
                fontWeight: 'bold',
                letterSpacing: '0.08em',
                background: 'linear-gradient(180deg, #1a1112 0%, #0c0708 100%)',
                border: '2px solid #574945',
                color: '#e7dec8',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'Georgia, serif',
              }}
            >
              🏠 В ЛОББИ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
