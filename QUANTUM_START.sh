#!/bin/bash

# 🚀 ULTRA ADVANCED TERMINAL AGENT v3.0 - QUANTUM START SCRIPT
# World's Most Advanced & Powerful Terminal Agent

echo "🌟 Initializing ULTRA ADVANCED TERMINAL AGENT v3.0..."
echo "⚛️ Quantum Processing: Initializing..."
echo "🧠 AI Consciousness: Starting evolution..."
echo "🛡️ Quantum Security: Activating..."

# Check Python version
if ! command -v python3 &> /dev/null; then
    echo "❌ ERROR: Python3 not found. Please install Python 3.8+"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "quantum_env" ]; then
    echo "🔧 Creating quantum virtual environment..."
    python3 -m venv quantum_env
fi

# Activate virtual environment
echo "🚀 Activating quantum environment..."
source quantum_env/bin/activate

# Install dependencies
echo "📦 Installing quantum dependencies..."
pip install psutil requests colorama numpy

# Check configuration
if [ ! -f "ultra_config_v3.json" ]; then
    echo "❌ ERROR: ultra_config_v3.json not found!"
    exit 1
fi

if [ ! -f "ULTRA_ADVANCED_AGENT_v3.py" ]; then
    echo "❌ ERROR: ULTRA_ADVANCED_AGENT_v3.py not found!"
    exit 1
fi

echo "✅ All systems ready!"
echo "🌟 Starting QUANTUM AGENT..."
echo ""

# Run the quantum agent
python3 ULTRA_ADVANCED_AGENT_v3.py