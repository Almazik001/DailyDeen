import { useState, type FormEvent } from 'react'

const TaskCategoriesPage = () => {
  const [categoryName, setCategoryName] = useState('')
  const [categories, setCategories] = useState<string[]>(['Work', 'Personal'])

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!categoryName.trim()) {
      return
    }

    setCategories((current) => [categoryName.trim(), ...current])
    setCategoryName('')
  }

  return (
    <div className="placeholder-view">
      <section className="dashboard-panel category-page">
        <div className="category-page__header">
          <h2 className="section-title">Create Categories</h2>
          <button
            className="category-page__back"
            type="button"
            onClick={() => {
              window.location.hash = 'dashboard'
            }}
          >
            Go Back
          </button>
        </div>

        <form className="category-page__form" onSubmit={handleCreate}>
          <label className="category-page__field">
            <span>Category Name</span>
            <input
              className="category-page__input"
              value={categoryName}
              onChange={(event) => {
                setCategoryName(event.target.value)
              }}
              placeholder="Enter category name"
            />
          </label>

          <div className="category-page__actions">
            <button className="category-page__button" type="submit">
              Create
            </button>
            <button
              className="category-page__button category-page__button--ghost"
              type="button"
              onClick={() => {
                setCategoryName('')
              }}
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="category-page__chips">
          {categories.map((category) => (
            <span className="category-page__chip" key={category}>
              {category}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}

export default TaskCategoriesPage
