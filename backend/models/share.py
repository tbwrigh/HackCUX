import sqlalchemy
from sqlalchemy import UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class Share(Base):
    __table__ = "whiteboard_shares"
    __tableargs__ = (UniqueConstraint('whiteboard_id', 'user_id'),)

    id: Mapped[int] = mapped_column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    whiteboard_id: Mapped[int] = mapped_column(sqlalchemy.Integer, sqlalchemy.ForeignKey('whiteboards.id'), nullable=False)
    user_id: Mapped[int] = mapped_column(sqlalchemy.Integer, sqlalchemy.ForeignKey('users.id'), nullable=False)

    def __repr__(self):
        return f"<Share(share_id={self.id}, whiteboard_id={self.whiteboard_id}, user_id={self.user_id})>"
    