import os
import sqlalchemy
from sqlalchemy.orm import Session

class DB:
    def __init__(self):
        self.engine = sqlalchemy.create_engine(
            os.environ["DATABASE_URL"], pool_size=15, max_overflow=5
        )

    def session(self) -> Session:
        return Session(self.engine)