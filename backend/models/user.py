import sqlalchemy
from sqlalchemy import UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class User(Base):
    __tablename__ = 'users'
    __tableargs__ = (UniqueConstraint('username', 'email'),)

    id: Mapped[int] = mapped_column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(sqlalchemy.String(50), nullable=False)
    password: Mapped[str] = mapped_column(sqlalchemy.String(50), nullable=False)

    def __repr__(self):
        return f"<User(user_id={self.id}, username={self.username}, email={self.email})>"