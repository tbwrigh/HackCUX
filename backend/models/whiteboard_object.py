import sqlalchemy
from sqlalchemy import UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class WhiteboardObject(Base):
    __tablename__ = 'whiteboard_objects'
    __tableargs__ = (UniqueConstraint('whiteboard_id', 'object_id'),)

    id: Mapped[int] = mapped_column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    whiteboard_id: Mapped[int] = mapped_column(sqlalchemy.Integer, sqlalchemy.ForeignKey('whiteboards.id'), nullable=False)
    creator_id: Mapped[int] = mapped_column(sqlalchemy.Integer, sqlalchemy.ForeignKey('users.id'), nullable=False)
    data: Mapped[dict] = mapped_column(sqlalchemy.JSON, nullable=False)

    def __repr__(self):
        return f"<WhiteboardObject(whiteboard_object_id={self.id}, whiteboard_id={self.whiteboard_id}, object_id={self.object_id}, object_type={self.object_type})>"