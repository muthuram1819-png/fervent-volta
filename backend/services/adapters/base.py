from abc import ABC, abstractmethod
import pandas as pd
from typing import Dict, Any, List

class BaseAdapter(ABC):
    """
    Adapter Interface normalizing raw external traffic/road datasets
    into common internal schema:
    [timestamp, vehicle_id, vehicle_type, latitude, longitude, speed, acceleration, road_id, intersection_id, direction, source]
    """

    @abstractmethod
    def normalize(self, df: pd.DataFrame) -> pd.DataFrame:
        pass

    @abstractmethod
    def get_source_metadata(self) -> Dict[str, Any]:
        pass
