import sqlalchemy
from sqlalchemy import UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class Whiteboard(Base):
    __tablename__ = 'whiteboards'
    __tableargs__ = (UniqueConstraint('name'),)

    id: Mapped[int] = mapped_column(sqlalchemy.Integer, primary_key=True)
    name: Mapped[str] = mapped_column(sqlalchemy.String(50), nullable=False)
    owner_id: Mapped[int] = mapped_column(sqlalchemy.Integer, sqlalchemy.ForeignKey('users.id'), nullable=False)

    def __repr__(self):
        return f"<Whiteboard(whiteboard_id={self.id}, name={self.name}, owner_id={self.owner_id})>"