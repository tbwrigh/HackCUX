"""no more object type col

Revision ID: 6d2c36ccc996
Revises: 7b88723c5178
Create Date: 2024-03-02 23:00:07.025360

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6d2c36ccc996'
down_revision: Union[str, None] = '7b88723c5178'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column('whiteboard_objects', 'type')


def downgrade() -> None:
    op.add_column('whiteboard_objects', sa.Column('type', sa.String(50), nullable=True))
