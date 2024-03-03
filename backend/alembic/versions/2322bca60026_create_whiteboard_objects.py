"""create_whiteboard_objects

Revision ID: 2322bca60026
Revises: 01a41c0c455c
Create Date: 2024-03-02 12:18:38.802166

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2322bca60026'
down_revision: Union[str, None] = '01a41c0c455c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "whiteboard_objects",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("type", sa.String(50), nullable=False),
        sa.Column("whiteboard_id", sa.Integer, sa.ForeignKey("whiteboards.id", ondelete="CASCADE"), nullable=False),
        sa.Column("creator_id", sa.Integer, sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("data", sa.JSON, nullable=False),
    )

def downgrade() -> None:
    op.drop_table("whiteboard_objects")
