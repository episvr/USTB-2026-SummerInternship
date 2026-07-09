from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import threading
import time

from .db import stats, disk_trend, pref_trend, host_ranking, disk_heatmap, disk_scatter, completeness, get_all_hosts, get_all_modules
from .importer import import_all


@asynccontextmanager
async def lifespan(app):
    def run_import():
        time.sleep(2)
        try:
            import_all()
        except Exception as e:
            print(f"Import error: {e}")
    t = threading.Thread(target=run_import, daemon=True)
    t.start()
    yield


app = FastAPI(title="Monitor API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/stats")
def get_stats(hours: int = Query(None, description="Filter last N hours")):
    return stats(hours)


@app.get("/api/disk/trend")
def get_disk_trend(hours: int = Query(None)):
    return {"data": disk_trend(hours)}


@app.get("/api/pref/trend")
def get_pref_trend(hours: int = Query(None)):
    return {"data": pref_trend(hours)}


@app.get("/api/disk/host-ranking")
def get_host_ranking(hours: int = Query(None)):
    return {"data": host_ranking(hours)}


@app.get("/api/disk/heatmap")
def get_disk_heatmap(hours: int = Query(None)):
    return disk_heatmap(hours)


@app.get("/api/disk/scatter")
def get_disk_scatter(hours: int = Query(None)):
    return {"data": disk_scatter(hours)}


@app.get("/api/completeness")
def get_completeness(hours: int = Query(None)):
    return completeness(hours)


@app.get("/api/hosts")
def get_hosts():
    return {"data": get_all_hosts()}


@app.get("/api/modules")
def get_modules():
    return {"data": get_all_modules()}
