"""create_whiteboard_shares

Revision ID: 3dd7c5353b75
Revises: 2322bca60026
Create Date: 2024-03-02 12:19:38.571830

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3dd7c5353b75'
down_revision: Union[str, None] = '2322bca60026'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "whiteboard_shares",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("whiteboard_id", sa.Integer, sa.ForeignKey("whiteboards.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("whiteboard_shares")
