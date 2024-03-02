"""create_users

Revision ID: 008032b1498c
Revises: 
Create Date: 2024-03-02 12:16:32.307021

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '008032b1498c'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("username", sa.String(50), nullable=False),
        sa.Column("password", sa.String(50), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("users")
