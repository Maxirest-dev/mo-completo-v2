#!/bin/bash
# V2 Design System Migration Script
# Updates all hardcoded colors to CSS custom properties

cd /Users/admin/mo-completo-v2/mo-frontend/src/app/features

FILES=$(find carta inventario produccion compras -name "*.ts" -type f -exec grep -l "styles:" {} \;)

for f in $FILES; do
  echo "Processing: $f"

  # ---- FILTER PILLS active state: new pill design ----
  sed -i '' \
    's/color: #F97316;/color: var(--primary-orange-dark);/g' \
    "$f"
  sed -i '' \
    's/border-color: #F97316;/border-color: var(--primary-orange-lighter);/g' \
    "$f"
  sed -i '' \
    's/background: #FFF7ED;/background: var(--primary-orange-light);/g' \
    "$f"
  sed -i '' \
    's/background-color: #FFF7ED;/background-color: var(--primary-orange-light);/g' \
    "$f"

  # ---- PRIMARY ORANGE ----
  sed -i '' \
    's/background: #F97316;/background: var(--primary-orange);/g' \
    "$f"
  sed -i '' \
    's/background-color: #F97316;/background-color: var(--primary-orange);/g' \
    "$f"
  sed -i '' \
    "s/iconoColor = '#F97316'/iconoColor = 'var(--primary-orange)'/g" \
    "$f"
  sed -i '' \
    "s/iconoColor || '#F97316'/iconoColor || 'var(--primary-orange)'/g" \
    "$f"

  # Focus border orange
  sed -i '' \
    's/border-color: #F97316;/border-color: var(--primary-orange);/g' \
    "$f"

  # Orange hover
  sed -i '' \
    's/background: #EA580C;/background: var(--primary-orange-hover);/g' \
    "$f"
  sed -i '' \
    's/background-color: #EA580C;/background-color: var(--primary-orange-hover);/g' \
    "$f"
  sed -i '' \
    's/color: #EA580C;/color: var(--primary-orange-hover);/g' \
    "$f"

  # Orange dark
  sed -i '' \
    's/background: #C2410C;/background: var(--primary-orange-dark);/g' \
    "$f"
  sed -i '' \
    's/background-color: #C2410C;/background-color: var(--primary-orange-dark);/g' \
    "$f"

  # Orange shadows
  sed -i '' \
    's/rgba(249, 115, 22, 0.1)/rgba(242, 121, 32, 0.1)/g' \
    "$f"
  sed -i '' \
    's/rgba(249,115,22,0.1)/rgba(242, 121, 32, 0.1)/g' \
    "$f"
  sed -i '' \
    's/rgba(249, 115, 22, 0.2)/rgba(242, 121, 32, 0.2)/g' \
    "$f"
  sed -i '' \
    's/rgba(249,115,22,0.2)/rgba(242, 121, 32, 0.2)/g' \
    "$f"
  sed -i '' \
    's/rgba(249,115,22,0.15)/rgba(242, 121, 32, 0.15)/g' \
    "$f"

  # Spinner border-top-color
  sed -i '' \
    's/border-top-color: #F97316;/border-top-color: var(--primary-orange);/g' \
    "$f"

  # Checkbox accent
  sed -i '' \
    's/accent-color: #F97316;/accent-color: var(--primary-orange);/g' \
    "$f"

  # #FF8800 -> var(--primary-orange)
  sed -i '' \
    's/color: #FF8800;/color: var(--primary-orange);/g' \
    "$f"
  sed -i '' \
    's/border: 1px solid #FF8800;/border: 1px solid var(--primary-orange);/g' \
    "$f"

  # stroke="#F97316" in SVG templates
  sed -i '' \
    's/stroke="#F97316"/stroke="currentColor"/g' \
    "$f"

  # ---- BORDERS #E5E7EB -> var(--border-color) ----
  sed -i '' \
    's/border: 1px solid #E5E7EB;/border: 1px solid var(--border-color);/g' \
    "$f"
  sed -i '' \
    's/border: 2px solid #E5E7EB;/border: 2px solid var(--border-color);/g' \
    "$f"
  sed -i '' \
    's/border-bottom: 1px solid #E5E7EB;/border-bottom: 1px solid var(--border-color);/g' \
    "$f"
  sed -i '' \
    's/border-top: 1px solid #E5E7EB;/border-top: 1px solid var(--border-color);/g' \
    "$f"
  sed -i '' \
    's/border-color: #E5E7EB;/border-color: var(--border-color);/g' \
    "$f"

  # ---- #F3F4F6 -> var(--slate-100) ----
  sed -i '' \
    's/background: #F3F4F6;/background: var(--slate-100);/g' \
    "$f"
  sed -i '' \
    's/background-color: #F3F4F6;/background-color: var(--slate-100);/g' \
    "$f"
  sed -i '' \
    's/border-bottom: 1px solid #F3F4F6;/border-bottom: 1px solid var(--slate-100);/g' \
    "$f"
  sed -i '' \
    's/border-top: 1px solid #F3F4F6;/border-top: 1px solid var(--slate-100);/g' \
    "$f"
  sed -i '' \
    's/border: 1px solid #F3F4F6;/border: 1px solid var(--slate-100);/g' \
    "$f"

  # ---- #FAFAFA -> var(--slate-50) ----
  sed -i '' \
    's/background: #FAFAFA;/background: var(--slate-50);/g' \
    "$f"

  # ---- #F9FAFB -> var(--slate-50) ----
  sed -i '' \
    's/background: #F9FAFB;/background: var(--slate-50);/g' \
    "$f"
  sed -i '' \
    's/background-color: #F9FAFB;/background-color: var(--slate-50);/g' \
    "$f"

  # ---- TEXT COLORS ----
  sed -i '' \
    's/color: #6B7280;/color: var(--slate-500);/g' \
    "$f"
  sed -i '' \
    's/color: #9CA3AF;/color: var(--slate-400);/g' \
    "$f"
  sed -i '' \
    's/color: #374151;/color: var(--text-primary);/g' \
    "$f"
  sed -i '' \
    's/color: #1F2937;/color: var(--text-heading);/g' \
    "$f"
  sed -i '' \
    's/color: #111827;/color: var(--slate-900);/g' \
    "$f"
  sed -i '' \
    's/color: #4B5563;/color: var(--slate-600);/g' \
    "$f"

  # Dark backgrounds
  sed -i '' \
    's/background-color: #1F2937;/background-color: var(--slate-900);/g' \
    "$f"
  sed -i '' \
    's/background: #1F2937;/background: var(--slate-900);/g' \
    "$f"
  sed -i '' \
    's/background: #374151;/background: var(--slate-800);/g' \
    "$f"
  sed -i '' \
    's/background-color: #374151;/background-color: var(--slate-800);/g' \
    "$f"

  # Slate-300 borders
  sed -i '' \
    's/border-color: #D1D5DB;/border-color: var(--slate-300);/g' \
    "$f"
  sed -i '' \
    's/background: #D1D5DB;/background: var(--slate-300);/g' \
    "$f"

  # ---- BORDER RADIUS ----
  # Cards 12px -> 14px (var(--radius-lg))
  sed -i '' \
    's/border-radius: 12px;/border-radius: var(--radius-lg);/g' \
    "$f"
  # Dialogs 16px -> var(--radius-xl)
  sed -i '' \
    's/border-radius: 16px;/border-radius: var(--radius-xl);/g' \
    "$f"
  # Small buttons 6px -> 8px (var(--radius-sm))
  sed -i '' \
    's/border-radius: 6px;/border-radius: var(--radius-sm);/g' \
    "$f"
  # Inputs 10px -> var(--radius-md)
  sed -i '' \
    's/border-radius: 10px;/border-radius: var(--radius-md);/g' \
    "$f"
  # Search/buttons 8px -> var(--radius-sm)
  sed -i '' \
    's/border-radius: 8px;/border-radius: var(--radius-sm);/g' \
    "$f"
  # Filter pills 9999px -> var(--radius-md) for filter tabs
  sed -i '' \
    's/border-radius: 9999px;/border-radius: var(--radius-sm);/g' \
    "$f"
  # Card 14px -> var(--radius-lg)
  sed -i '' \
    's/border-radius: 14px;/border-radius: var(--radius-lg);/g' \
    "$f"

  # ---- BADGE COLORS (design system) ----
  # Green
  sed -i '' \
    's/background: #D1FAE5;/background: var(--success-bg);/g' \
    "$f"
  sed -i '' \
    's/background-color: #D1FAE5;/background-color: var(--success-bg);/g' \
    "$f"
  sed -i '' \
    's/color: #065F46;/color: var(--success-text);/g' \
    "$f"
  sed -i '' \
    's/background: #10B981;/background: var(--success-color);/g' \
    "$f"
  sed -i '' \
    's/background-color: #10B981;/background-color: var(--success-color);/g' \
    "$f"

  # Amber/Warning
  sed -i '' \
    's/background: #FEF3C7;/background: var(--warning-bg);/g' \
    "$f"
  sed -i '' \
    's/background-color: #FEF3C7;/background-color: var(--warning-bg);/g' \
    "$f"
  sed -i '' \
    's/color: #92400E;/color: var(--warning-text);/g' \
    "$f"
  sed -i '' \
    's/background: #F59E0B;/background: var(--warning-color);/g' \
    "$f"
  sed -i '' \
    's/background-color: #F59E0B;/background-color: var(--warning-color);/g' \
    "$f"

  # Red/Danger
  sed -i '' \
    's/background: #FEE2E2;/background: var(--danger-bg);/g' \
    "$f"
  sed -i '' \
    's/background-color: #FEE2E2;/background-color: var(--danger-bg);/g' \
    "$f"
  sed -i '' \
    's/color: #991B1B;/color: var(--danger-text);/g' \
    "$f"
  sed -i '' \
    's/background: #EF4444;/background: var(--danger-color);/g' \
    "$f"
  sed -i '' \
    's/background-color: #EF4444;/background-color: var(--danger-color);/g' \
    "$f"

  # Blue/Info
  sed -i '' \
    's/background: #DBEAFE;/background: var(--info-bg);/g' \
    "$f"
  sed -i '' \
    's/background-color: #DBEAFE;/background-color: var(--info-bg);/g' \
    "$f"
  sed -i '' \
    's/color: #1E40AF;/color: var(--info-text);/g' \
    "$f"

  # ---- CARD SHADOWS ----
  sed -i '' \
    's/box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);/box-shadow: var(--shadow-sm);/g' \
    "$f"
  sed -i '' \
    's/box-shadow: 0 1px 3px rgba(0,0,0,0.08);/box-shadow: var(--shadow-sm);/g' \
    "$f"
  sed -i '' \
    's/box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);/box-shadow: var(--shadow-sm);/g' \
    "$f"

done

echo "=== V2 Design System migration complete ==="
