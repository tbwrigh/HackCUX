"""create_whiteboards

Revision ID: 01a41c0c455c
Revises: 008032b1498c
Create Date: 2024-03-02 12:17:36.275560

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '01a41c0c455c'
down_revision: Union[str, None] = '008032b1498c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "whiteboards",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(50), nullable=False),
        sa.Column("owner_id", sa.Integer, sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("whiteboards")
