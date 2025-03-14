# Generated by Django 5.1.6 on 2025-03-11 18:38

import django.contrib.auth.models
import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone
import main.models
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Batch',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100, unique=True)),
                ('fat', models.IntegerField(null=True)),
                ('protein', models.IntegerField(null=True)),
                ('snf', models.IntegerField(null=True)),
                ('sol', models.IntegerField(null=True)),
                ('den', models.IntegerField(null=True)),
                ('lactose', models.IntegerField(null=True)),
                ('temp', models.IntegerField(null=True)),
                ('fp', models.IntegerField(null=True)),
                ('calories', models.IntegerField(null=True)),
                ('pasteurization', models.CharField(choices=[('POSITIVE', 'Positive'), ('NEGATIVE', 'Negative'), ('NO_RESULT', 'No_Result')], default='NO_RESULT', max_length=50)),
                ('pasteurization_report', models.FileField(max_length=500, null=True, upload_to=main.models.pasteurization_report_loc)),
                ('analyzer_report', models.FileField(max_length=500, null=True, upload_to=main.models.analyzer_report_loc)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Child',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('reg_number', models.CharField(max_length=200, unique=True)),
                ('reg_date', models.DateTimeField()),
                ('name', models.CharField(max_length=100)),
                ('age', models.IntegerField()),
                ('sex', models.CharField(max_length=10)),
                ('mother_name', models.CharField(blank=True, max_length=100, null=True)),
                ('ward', models.CharField(blank=True, max_length=100, null=True)),
                ('birth_weight', models.IntegerField(null=True)),
                ('current_weight', models.IntegerField(null=True)),
                ('diagnose', models.TextField(blank=True, null=True)),
                ('doctor_name', models.CharField(blank=True, max_length=100, null=True)),
                ('doctor_contact', models.CharField(blank=True, max_length=50, null=True)),
                ('doctor_designation', models.CharField(blank=True, max_length=100, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Hospital',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100, unique=True)),
                ('branch', models.CharField(blank=True, max_length=100, null=True)),
                ('contact', models.CharField(blank=True, max_length=50, null=True)),
                ('address', models.TextField(blank=True, null=True)),
                ('is_analyzer', models.BooleanField(default=False)),
                ('subscription', models.CharField(choices=[('PLAN_1_YEAR', 'Plan_1_Year'), ('PLAN_2_YEAR', 'Plan_2_Year'), ('PLAN_3_YEAR', 'Plan_3_Year'), ('PLAN_FREE', 'Plan_Free')], max_length=50)),
                ('subscription_end', models.DateField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('logo', models.ImageField(max_length=500, null=True, upload_to=main.models.hospital_logo)),
            ],
        ),
        migrations.CreateModel(
            name='Dispatch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField()),
                ('dispatched_at', models.DateTimeField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('batch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='dispatches', to='main.batch')),
                ('child', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.child')),
            ],
        ),
        migrations.AddField(
            model_name='child',
            name='hospital',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='children', to='main.hospital'),
        ),
        migrations.AddField(
            model_name='batch',
            name='hospital',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='batches', to='main.hospital'),
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('role', models.CharField(choices=[('ADMIN', 'Admin'), ('HOSPITAL_ADMIN', 'Hospital_Admin'), ('HOSPITAL_USER', 'Hospital_User')], max_length=50)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
                ('hospital', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='users', to='main.hospital')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Mother',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('reg_number', models.CharField(max_length=200, unique=True)),
                ('reg_date', models.DateTimeField()),
                ('name', models.CharField(max_length=100)),
                ('age', models.IntegerField()),
                ('height', models.IntegerField(null=True)),
                ('weight', models.IntegerField(null=True)),
                ('education', models.CharField(blank=True, max_length=100, null=True)),
                ('blood_group', models.CharField(blank=True, max_length=20, null=True)),
                ('relative_name', models.CharField(blank=True, max_length=100, null=True)),
                ('relative_type', models.CharField(blank=True, max_length=100, null=True)),
                ('relative_contact', models.CharField(blank=True, max_length=50, null=True)),
                ('relative_email', models.CharField(blank=True, max_length=200, null=True)),
                ('relative_address', models.TextField(blank=True, null=True)),
                ('delivery_date', models.DateTimeField(null=True)),
                ('delivery_mode', models.CharField(blank=True, max_length=100, null=True)),
                ('medical_issues', models.TextField(blank=True, null=True)),
                ('surgical_issues', models.TextField(blank=True, null=True)),
                ('screening_report', models.FileField(max_length=500, null=True, upload_to=main.models.screening_report_loc)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('hospital', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mothers', to='main.hospital')),
            ],
        ),
        migrations.CreateModel(
            name='Donation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField()),
                ('donated_at', models.DateTimeField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('mother', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='donations', to='main.mother')),
            ],
        ),
        migrations.CreateModel(
            name='Collection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField()),
                ('collected_at', models.DateTimeField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('batch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='collections', to='main.batch')),
                ('mother', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='collections', to='main.mother')),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='batch',
            unique_together={('name', 'hospital')},
        ),
    ]
