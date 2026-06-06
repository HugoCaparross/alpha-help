"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import "../styles/auth.css";

export default function RegisterForm() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [acceptedPolicy, setAcceptedPolicy] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* PARTICIPANTE */

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");

  /* MENOR */

  const [childName, setChildName] = useState("");
  const [childGender, setChildGender] = useState("");
  const [childAge, setChildAge] = useState("");
  const [schoolYear, setSchoolYear] = useState("");

  /* FAMILIA */

  const [maritalStatus, setMaritalStatus] = useState("");
  const [householdMembers, setHouseholdMembers] = useState("");
  const [livingSituation, setLivingSituation] = useState("");
  const [region, setRegion] = useState("España");

  function nextStep() {
    setStep((prev) => prev + 1);
  }

  function previousStep() {
    setStep((prev) => prev - 1);
  }

  function validateStepOne() {
    if (!email.trim()) {
      setError("Introduce un correo electrónico.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!acceptedPolicy) {
      setError("Debes aceptar la política de privacidad.");
      return;
    }

    setError("");
    nextStep();
  }

  function validateStepTwo() {
    if (!firstName.trim() || !lastName.trim() || !gender || !birthDate) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    setError("");
    nextStep();
  }

  function validateStepThree() {
    if (!childName.trim() || !childGender || !childAge || !schoolYear) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    setError("");
    nextStep();
  }

  function validateStepFour() {
    if (!maritalStatus || !householdMembers || !livingSituation) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    setError("");
    nextStep();
  }

  async function handleRegister() {
    try {
      setLoading(true);

      setError("");

      const { error } = await supabase.auth.signUp({
        email,
        password,

        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,

          data: {
            first_name: firstName,
            last_name: lastName,

            gender,
            birth_date: birthDate,

            education_level: educationLevel,

            employment_status: employmentStatus,

            child_name: childName,

            child_gender: childGender,

            child_age: childAge,

            school_year: schoolYear,

            marital_status: maritalStatus,

            household_members: householdMembers,

            living_situation: livingSituation,

            region,

            accepted_policy: acceptedPolicy,
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      window.location.href = "/verify-email";
    } catch {
      setError("Ha ocurrido un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-card">
      <div className="register-header">
        <span className="register-badge">Registro</span>

        <h1 className="register-title">Crear cuenta</h1>

        <p className="register-description">
          Participa gratuitamente en el proyecto Alpha-Help.
        </p>
      </div>

      <div className="register-stepper">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="register-step-wrapper">
            <div
              className={`
          register-step
          ${step === item ? "register-step--active" : ""}
          ${step > item ? "register-step--completed" : ""}
        `}
            >
              {step > item ? "✓" : ""}
            </div>

            {item < 5 && (
              <div
                className={`
            register-step-line
            ${step > item ? "active" : ""}
          `}
              />
            )}
          </div>
        ))}
      </div>

      <div className="register-step-label">
        {step === 1 && "Cuenta"}

        {step === 2 && "Participante"}

        {step === 3 && "Menor"}

        {step === 4 && "Familia"}

        {step === 5 && "Confirmación"}
      </div>

      {step === 1 && (
        <div>
          <h2 className="step-content">Cuenta</h2>

          <p className="step-description">Crea tus credenciales de acceso.</p>

          {error && <p className="auth-error">{error}</p>}

          <div className="auth-field">
            <label className="auth-label">Correo electrónico</label>

            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Contraseña</label>

            <div className="auth-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="auth-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Confirmar contraseña</label>

            <div className="auth-input-wrapper">
              <input
                type={showConfirm ? "text" : "password"}
                className="auth-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="button"
                className="auth-toggle"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <label className="auth-checkbox">
            <input
              type="checkbox"
              checked={acceptedPolicy}
              onChange={(e) => setAcceptedPolicy(e.target.checked)}
            />

            <span>He leído y acepto la política de privacidad.</span>
          </label>

          <button
            type="button"
            className="btn-primary w-full"
            onClick={validateStepOne}
          >
            Continuar
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="step-content">Datos del participante</h2>

          <p className="step-description">
            Información del padre, madre o tutor legal.
          </p>

          {error && <p className="auth-error">{error}</p>}

          <div className="family-grid">
            <div className="auth-field">
              <label className="auth-label">Nombre</label>

              <input
                type="text"
                className="auth-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Apellidos</label>

              <input
                type="text"
                className="auth-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Sexo</label>

              <select
                className="auth-input"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Seleccionar</option>

                <option value="hombre">Hombre</option>

                <option value="mujer">Mujer</option>

                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="auth-field">
              <label className="auth-label">Fecha de nacimiento</label>

              <input
                type="date"
                className="auth-input"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Nivel de estudios</label>

              <select
                className="auth-input"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
              >
                <option value="">Seleccionar</option>

                <option>Estudios básicos</option>

                <option>Bachillerato</option>

                <option>Formación Profesional</option>

                <option>Universidad</option>

                <option>Posgrado</option>
              </select>
            </div>

            <div className="auth-field">
              <label className="auth-label">Situación laboral</label>

              <select
                className="auth-input"
                value={employmentStatus}
                onChange={(e) => setEmploymentStatus(e.target.value)}
              >
                <option value="">Seleccionar</option>

                <option>Trabajando</option>

                <option>Autónomo</option>

                <option>Desempleado</option>

                <option>Jubilado</option>
              </select>
            </div>
          </div>

          <div className="step-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={previousStep}
            >
              <ArrowLeft size={18} />
              Atrás
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={validateStepTwo}
            >
              Continuar
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="step-content">Datos del menor</h2>

          <p className="step-description">
            Información del adolescente participante.
          </p>

          {error && <p className="auth-error">{error}</p>}

          <div className="family-grid">
            <div className="auth-field">
              <label className="auth-label">Nombre del menor</label>

              <input
                type="text"
                className="auth-input"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Sexo</label>

              <select
                className="auth-input"
                value={childGender}
                onChange={(e) => setChildGender(e.target.value)}
              >
                <option value="">Seleccionar</option>

                <option value="hombre">Hombre</option>

                <option value="mujer">Mujer</option>

                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="auth-field">
              <label className="auth-label">Edad</label>

              <input
                type="number"
                min="10"
                max="16"
                className="auth-input"
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Curso escolar</label>

              <select
                className="auth-input"
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value)}
              >
                <option value="">Seleccionar</option>

                <option>5º Primaria</option>

                <option>6º Primaria</option>

                <option>1º ESO</option>

                <option>2º ESO</option>

                <option>3º ESO</option>

                <option>4º ESO</option>
              </select>
            </div>
          </div>

          <div className="step-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={previousStep}
            >
              <ArrowLeft size={18} />
              Atrás
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={validateStepThree}
            >
              Continuar
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="step-content">Información familiar</h2>

          <p className="step-description">
            Datos del entorno familiar del menor.
          </p>

          {error && <p className="auth-error">{error}</p>}

          <div className="family-grid">
            <div className="auth-field">
              <label className="auth-label">Estado civil</label>

              <select
                className="auth-input"
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
              >
                <option value="">Seleccionar</option>

                <option>Soltero/a</option>

                <option>Casado/a</option>

                <option>Divorciado/a</option>

                <option>Viudo/a</option>

                <option>Pareja de hecho</option>
              </select>
            </div>

            <div className="auth-field">
              <label className="auth-label">Personas en el hogar</label>

              <input
                type="number"
                min="1"
                className="auth-input"
                value={householdMembers}
                onChange={(e) => setHouseholdMembers(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Situación de convivencia</label>

              <select
                className="auth-input"
                value={livingSituation}
                onChange={(e) => setLivingSituation(e.target.value)}
              >
                <option value="">Seleccionar</option>

                <option>Ambos progenitores</option>

                <option>Custodia compartida</option>

                <option>Solo madre</option>

                <option>Solo padre</option>

                <option>Otros familiares</option>
              </select>
            </div>

            <div className="auth-field">
              <label className="auth-label">Comunidad autónoma</label>

              <select
                className="auth-input"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option>Andalucía</option>

                <option>Aragón</option>

                <option>Asturias</option>

                <option>Baleares</option>

                <option>Canarias</option>

                <option>Cantabria</option>

                <option>Castilla-La Mancha</option>

                <option>Castilla y León</option>

                <option>Cataluña</option>

                <option>Comunidad Valenciana</option>

                <option>Extremadura</option>

                <option>Galicia</option>

                <option>Madrid</option>

                <option>Murcia</option>

                <option>Navarra</option>

                <option>País Vasco</option>

                <option>La Rioja</option>
              </select>
            </div>
          </div>

          <div className="step-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={previousStep}
            >
              <ArrowLeft size={18} />
              Atrás
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={validateStepFour}
            >
              Continuar
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div>
          <h2 className="step-content">Confirmar registro</h2>

          <p className="step-description">
            Revisa la información antes de crear tu cuenta.
          </p>

          {error && <p className="auth-error">{error}</p>}

          <div className="register-summary">
            <div className="summary-item">
              <span>Email</span>
              <strong>{email}</strong>
            </div>

            <div className="summary-item">
              <span>Nombre</span>
              <strong>
                {firstName} {lastName}
              </strong>
            </div>

            <div className="summary-item">
              <span>Sexo</span>
              <strong>{gender}</strong>
            </div>

            <div className="summary-item">
              <span>Menor</span>
              <strong>{childName}</strong>
            </div>

            <div className="summary-item">
              <span>Edad</span>
              <strong>{childAge}</strong>
            </div>

            <div className="summary-item">
              <span>Curso</span>
              <strong>{schoolYear}</strong>
            </div>

            <div className="summary-item">
              <span>Estado civil</span>
              <strong>{maritalStatus}</strong>
            </div>

            <div className="summary-item">
              <span>Convivencia</span>
              <strong>{livingSituation}</strong>
            </div>

            <div className="summary-item">
              <span>Región</span>
              <strong>{region}</strong>
            </div>
          </div>

          <div className="step-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={previousStep}
            >
              <ArrowLeft size={18} />
              Atrás
            </button>

            <button
              type="button"
              className="btn-primary"
              disabled={loading}
              onClick={handleRegister}
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
