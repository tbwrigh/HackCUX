import sqlalchemy
from sqlalchemy import UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class Share(Base):
    __table__ = "whiteboard_object_vector_id_mappings"

    id: Mapped[int] = mapped_column(sqlalchemy.Integer, primary_key=True)
    whiteboard_obj_id: Mapped[int] = mapped_column(sqlalchemy.Integer, sqlalchemy.ForeignKey('whiteboard_objects.id'), nullable=False)

    def __repr__(self):
        return f"<Share(whiteboard_obj_id={self.whiteboard_obj_id})>"  
    