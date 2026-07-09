<template>
  <div class="panel" style="grid-column: span 2;">
    <div class="panel-header">
      <div class="panel-title">
        <span class="panel-dot"></span>
        <h3>指标字典 & 主机列表</h3>
      </div>
      <span class="panel-sub">{{ mods.length }} 个指标 | {{ hosts.length }} 台主机</span>
    </div>
    <div class="panel-body browser">
      <div class="browser-col">
        <div class="browser-col-header">
          <span class="browser-icon">📋</span>
          <span>指标字典</span>
          <span class="browser-count">{{ mods.length }}</span>
        </div>
        <table class="browser-table">
          <thead><tr><th>指标名</th><th>描述</th><th>类型</th><th>单位</th></tr></thead>
          <tbody>
            <tr v-for="m in mods" :key="m.mod">
              <td><code>{{ m.mod }}</code></td>
              <td>{{ m.desc }}</td>
              <td><span class="tag" :class="m.type">{{ m.type }}</span></td>
              <td class="unit">{{ m.unit }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="browser-col">
        <div class="browser-col-header">
          <span class="browser-icon">🖥</span>
          <span>主机列表</span>
          <span class="browser-count">{{ hosts.length }}</span>
        </div>
        <table class="browser-table">
          <thead><tr><th>主机名</th><th>负责人</th><th>型号</th><th>位置</th></tr></thead>
          <tbody>
            <tr v-for="h in hosts" :key="h.hostid">
              <td><code>{{ h.hostname }}</code></td>
              <td>{{ h.owner }}</td>
              <td class="model">{{ h.model }}</td>
              <td class="loc">{{ h.location1 }} / {{ h.location2 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ hosts: Array, mods: Array })
</script>

<style scoped>
.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
}
.panel-dot {
  width: 4px;
  height: 16px;
  border-radius: 2px;
  background: linear-gradient(180deg, #8b5cf6, #a78bfa);
  flex-shrink: 0;
}
.browser {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  max-height: 420px;
  overflow: hidden;
  padding: 0;
}
.browser-col {
  overflow-y: auto;
  padding: 14px;
}
.browser-col:first-child {
  border-right: 1px solid rgba(255,255,255,0.06);
}
.browser-col-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #e8edf5;
}
.browser-icon { font-size: 14px; }
.browser-count {
  margin-left: auto;
  background: rgba(139,92,246,0.15);
  color: #a78bfa;
  padding: 1px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}
.browser-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.browser-table thead { position: sticky; top: 0; z-index: 1; }
.browser-table th {
  text-align: left;
  padding: 6px 8px;
  color: #64748b;
  font-weight: 500;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: #162236;
}
.browser-table td {
  padding: 5px 8px;
  border-bottom: 1px solid rgba(255,255,255,0.03);
}
.browser-table tbody tr {
  transition: background 0.15s;
}
.browser-table tbody tr:hover {
  background: rgba(255,255,255,0.03);
}
code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 11px;
  color: #e8edf5;
}
.unit {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 11px;
  color: #94a3b8;
}
.model {
  font-size: 11px;
  color: #94a3b8;
}
.loc {
  font-size: 11px;
  color: #64748b;
}
.tag {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.3px;
}
.tag.disk {
  background: rgba(59,130,246,0.15);
  color: #60a5fa;
}
.tag.pref {
  background: rgba(16,185,129,0.15);
  color: #34d399;
}
</style>
